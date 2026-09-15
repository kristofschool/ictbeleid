# Smartschool single sign-on — opstarten

De site is niet langer puur statisch: `server.js` (Node.js/Express) zet zich vóór alle pagina's en laat niemand door zonder geldige Smartschool-login. Dit was nodig omdat een echte toegangscontrole nooit alleen in de browser (HTML/CSS/JS) kan afgedwongen worden — de geheime app secret mag nooit in code terechtkomen die de browser kan zien, en moet dus server-side blijven.

## Eenmalig instellen

1. **Node.js 18 of hoger** nodig op de server waar dit draait.
2. In de sitemap:
   ```
   npm install
   cp .env.example .env
   ```
3. Vul `.env` aan met je eigen gegevens (app ID, app secret, callback-URL, een willekeurige `SESSION_SECRET`). Vul dit rechtstreeks in het bestand in — nooit in een chatgesprek.
4. Zorg dat de `SMARTSCHOOL_CALLBACK_URL` in `.env` exact overeenkomt met de redirect-URI die je bij je OAuth-aanvraag bij Smartschool hebt opgegeven.

## Starten

```
npm start
```

De site draait dan op de poort uit `.env` (standaard 3000). Elke bezoeker die nog niet ingelogd is, wordt automatisch naar Smartschool gestuurd en na een succesvolle login terug naar de pagina die hij/zij probeerde te bezoeken.

## Hosting

Dit vereist een server die Node.js-processen kan draaien (bv. een eigen/school-server, of een dienst zoals Render, Railway, een VPS, …) — een gewone "statische bestanden"-webhost (zoals de meeste schoolwebsite-pakketten) is hiervoor niet voldoende. Laat het me weten welke hostingomgeving je gebruikt of overweegt, dan kijk ik mee naar de configuratie (bv. HTTPS, reverse proxy, omgevingsvariabelen instellen).

## Endpoints die deze server gebruikt

- Autoriseren: `{SMARTSCHOOL_BASE_URL}/OAuth`
- Token uitwisselen: `{SMARTSCHOOL_BASE_URL}/OAuth/index/token`
- Gebruikersinfo: `{SMARTSCHOOL_BASE_URL}/Api/V1/userinfo`

Dit zijn de standaardpaden die Smartschool's eigen OAuth-documentatie en bestaande integraties gebruiken. Controleer dit tegen de bevestiging die je van Smartschool ontving bij je OAuth-aanvraag — sommige scholen krijgen een platform-specifiek subdomein in plaats van `oauth.smartschool.be`.
