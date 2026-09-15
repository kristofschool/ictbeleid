// Server voor de ICT-beleid site, met verplichte single sign-on via Smartschool.
// Vereist Node.js 18+ (voor de ingebouwde fetch).
//
// Werking:
//  1. Elke pagina/asset is afgeschermd. Niet ingelogde bezoekers worden naar
//     /auth/login gestuurd, dat doorstuurt naar Smartschool.
//  2. Na inloggen stuurt Smartschool de gebruiker terug naar /auth/callback
//     met een "code". De server wisselt die code in voor een token, haalt de
//     gebruikersinfo op, en start een sessie.
//  3. Vanaf dan mag de gebruiker de site bekijken tot de sessie verloopt of
//     hij/zij uitlogt via /auth/logout.

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');

const {
  SMARTSCHOOL_BASE_URL = 'https://oauth.smartschool.be',
  SMARTSCHOOL_CLIENT_ID,
  SMARTSCHOOL_CLIENT_SECRET,
  SMARTSCHOOL_CALLBACK_URL,
  SESSION_SECRET,
  PORT = 3000,
  NODE_ENV,
} = process.env;

const missing = ['SMARTSCHOOL_CLIENT_ID', 'SMARTSCHOOL_CLIENT_SECRET', 'SMARTSCHOOL_CALLBACK_URL', 'SESSION_SECRET']
  .filter((key) => !process.env[key]);

if (missing.length) {
  console.error(
    `Ontbrekende configuratie in .env: ${missing.join(', ')}.\n` +
    'Kopieer .env.example naar .env en vul je eigen Smartschool-gegevens in.'
  );
  process.exit(1);
}

// Endpoints zoals gedocumenteerd door Smartschool (zie ook smartschool.be/developers).
// Controleer dit tegen de bevestigingsmail van je OAuth-aanvraag: sommige
// schoolplatformen gebruiken een eigen subdomein in plaats van "oauth.smartschool.be".
const AUTHORIZE_URL = `${SMARTSCHOOL_BASE_URL}/OAuth`;
const TOKEN_URL = `${SMARTSCHOOL_BASE_URL}/OAuth/index/token`;
const USERINFO_URL = `${SMARTSCHOOL_BASE_URL}/Api/V1/userinfo`;

const app = express();
app.set('trust proxy', 1); // nodig als de site achter een reverse proxy / load balancer draait

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: NODE_ENV === 'production', // vereist HTTPS — laat aan in productie
    maxAge: 8 * 60 * 60 * 1000, // 8 uur
  },
}));

// ---------------------------------------------------------------------------
// Auth-routes: dit zijn de ENIGE routes die zonder sessie bereikbaar zijn.
// ---------------------------------------------------------------------------

app.get('/auth/login', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex');
  req.session.oauthState = state;
  req.session.returnTo = req.query.returnTo && req.query.returnTo.startsWith('/')
    ? req.query.returnTo
    : '/';

  const params = new URLSearchParams({
    client_id: SMARTSCHOOL_CLIENT_ID,
    redirect_uri: SMARTSCHOOL_CALLBACK_URL,
    response_type: 'code',
    state,
  });
  res.redirect(`${AUTHORIZE_URL}?${params.toString()}`);
});

app.get('/auth/callback', async (req, res) => {
  const { code, state, error, error_description } = req.query;

  if (error) {
    return res.status(403).send(`Inloggen geweigerd door Smartschool: ${error_description || error}`);
  }
  if (!code || !state || state !== req.session.oauthState) {
    return res.status(400).send('Ongeldige of verlopen aanmeldpoging. Ga terug naar de site en probeer opnieuw.');
  }
  delete req.session.oauthState;

  try {
    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: SMARTSCHOOL_CLIENT_ID,
        client_secret: SMARTSCHOOL_CLIENT_SECRET,
        redirect_uri: SMARTSCHOOL_CALLBACK_URL,
      }),
    });
    if (!tokenRes.ok) {
      throw new Error(`Token-aanvraag mislukt (status ${tokenRes.status})`);
    }
    const tokenData = await tokenRes.json();

    const userRes = await fetch(USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!userRes.ok) {
      throw new Error(`Ophalen gebruikersinfo mislukt (status ${userRes.status})`);
    }
    const profile = await userRes.json();

    req.session.user = {
      id: profile.userID,
      username: profile.username || null,
      name: profile.fullname || [profile.name, profile.surname].filter(Boolean).join(' '),
      platform: profile.platform || null,
    };

    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
  } catch (err) {
    console.error('Smartschool OAuth-fout:', err);
    res.status(502).send('Er ging iets mis bij het aanmelden met Smartschool. Probeer het later opnieuw.');
  }
});

app.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// ---------------------------------------------------------------------------
// Toegangscontrole: alles hieronder vereist een geldige sessie.
// ---------------------------------------------------------------------------

app.use((req, res, next) => {
  if (req.session.user) return next();
  res.redirect(`/auth/login?returnTo=${encodeURIComponent(req.originalUrl)}`);
});

// Server-bestanden nooit als statisch bestand laten serveren, ook niet voor
// ingelogde gebruikers.
const BLOCKED_FILES = new Set([
  'server.js', 'package.json', 'package-lock.json',
  '.env', '.env.example', '.gitignore', 'SSO-SETUP.md',
]);
app.use((req, res, next) => {
  if (BLOCKED_FILES.has(path.basename(req.path))) return res.status(404).end();
  next();
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Site draait op http://localhost:${PORT} (Smartschool-login vereist)`);
});
