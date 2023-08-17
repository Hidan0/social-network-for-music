# Relazione

Relazione del progetto *"Social Network for Music (SNM)"* per il corso di [*Programmazione e linguaggi per il web*](https://www.unimi.it/it/corsi/insegnamenti-dei-corsi-di-laurea/2022/programmazione-web-e-mobile) (A.A 2022-2023). Realizzata da Monilia Riccardo (981730).



## Obiettivo

Il presente progetto si propone di sviluppare un'applicazione web completa, comprensiva di *frontend* e *backend*, che si concentra sulla gestione e la condivisione di playlist musicali.

Gli obiettivi specifici comprendono:

1. **Gesione degli utenti**: creazione, visualizzazione, modifica, eliminazione;
2. **Gestione delle playlist**: creazione, visualizzazione, modifica, **condivisione**, eliminazione;
3. **Integrazione con l'API di Spotify**: utilizzare l'API di Spotify per ottenere informazioni sui brani, sugli artisti e sui generi. Consentire agli utenti di importare brani da Spotify nelle proprie playlist dell'applicazione *SNM*.



## Struttura del progetto

Il progetto è stato suddiviso in una parte frontend e una parte backend, che operano in modo completamente indipendente. Ciascuna di queste parti è stata organizzata all'interno di una propria cartella, denominata rispettivamente `/frontend` e `/backend`.

### Stack tecnologico

**Backend** (in `TypeScript`)

- Gestione delle richieste REST:`express`
- Comunicazione con il database: `mongoose`
- Swagger UI: `swagger-ui-express`
- Validazione campi: `zod`

**Frontend** (in `TypeScript`)

- Framework: `VueJs`
- Styling delle pagine: `bootstrap`
- Richieste HTTP: `axios`
- Validazione campi: `zod`

**Database**

- `MongoDB`

### Organizzazione codice

#### Backend

L'infrastruttura di backend è stata realizzata tramite Express.js, fornendo un'API RESTful per la gestione delle richieste e delle risposte nell'applicazione web. Al fine di utilizzare TypeScritpt per lo sviluppo, è stato necessario adottare un runtime differente da Node.js, pertanto è stato impiegato `ts-node`, che consente di eseguire direttamente TypeScript su Node.js senza bisogno di precompilazione.

Per semplificare il processo di sviluppo e migliorare l'efficienza, è stato implementato `nodemon`, che offre la funzionalità di *hot-reload*, consentendo il ricaricamento automatico dell'applicazione in fase di sviluppo senza bisogno di riavviare manualmente il server.

Struttura cartelle (in `src/`):

- `controllers`: funzioni cruciali nella gestione delle richieste attraverso l'API REST, contengono la logica necessaria per elaborare e rispondere alle richieste in modo appropriato;
- `db`: contiene le definizioni e le configurazioni necessarie per stabilire la connessione con il database, consentendo il salvataggio e il recupero dei dati da e verso l'applicazione;
- `middlewares`: funzioni intermedie che vengono eseguite prima di gestire le richieste principali, svolgendo compiti come l'autenticazione degli utenti;
- `router`: contiene le definizioni dei vari endpoint;
- `utils`: contiene diverse utilità, come la definizione dei regex e funzioni di hash;
- `validator`: contiene le utilità per validare gli oggetti attraverso `zod`.

Viene inoltre esposto uno *swagger* all'indirizzo `<host>/api/docs`.

#### Frontend

La parte di frontend è stata implementata attraverso il framework Vue.js. L'adozione del client routing fornito da Vue.js ha consentito la creazione di un'applicazione di tipo *single page*, dove la navigazione avviene senza la necessità di ricaricare l'intera pagina. 

Il frontend è stato reso responsive attraverso l'utilizzo di Bootstrap e dei suoi componenti, assicurando che l'interfaccia si adatti in modo ottimale a diverse dimensioni di schermo e dispositivi.

Per quanto riguarda l'interazione con l'API, è stata adottata un'organizzazione centralizzata. Le richieste all'API sono gestite attraverso funzioni specifiche presenti nello store dell'applicazione (`Pinia`). Questo approccio consente di mantenere un'astrazione coesa tra il frontend e l'API sottostante, semplificando l'accesso ai dati e mantenendo un alto grado di modularità nel codice.

Struttura cartelle (in `src/`):

- `assets`: contiene risorse statiche come immagini, icone, font e altri elementi multimediali utilizzati nell'interfaccia dell'applicazione;
- `components`: contiene i componenti riutilizzabili dell'interfaccia utente;
- `pages`: contiene le pagine principali dell'applicazione, ognuna rappresentando una vista distinta dell'interfaccia utente, organizzate in modo da agevolare la navigazione e la gestione del routing;
- `stores`: contiene lo stato globale dell'applicazione e le funzioni di gestione dello stato, consentendo una gestione centralizzata e coesa dei dati condivisi tra diversi componenti;
- `types`: contiene le definizioni dei tipi globali di TypeScript;
- `utils`: contiene diverse utilità.

#### Overview

```mermaid
flowchart TD
subgraph gbe [Backend]
	ejs(Express.js) -- exposes --> api(REST API)
	ejs <--mongoose--> db[(MongoDB)]
end
ejs -- API --> sp(Spotify)
subgraph gfe [Frontend]
	vue(Vue.js) -- uses --> p(Pinia stores)
	p <-- API --> api
end
```

## Scelte implementative

A seguire alcune scelete implementative significative.

### Autenticazione ed autorizzazione

Nel contesto dell'applicazione, il meccanismo di autenticazione e autorizzazione è strutturato attorno all'uso di un *token*, che viene trasmesso attraverso gli headers delle richieste.

Durante la fase di registrazione di un nuovo utente, un "*salt*" viene generato in modo univoco e salvato nel database. Successivamente, la password dell'utente viene sottoposta a un processo di hash utilizzando il "*salt*" generato e una frase segreta aggiuntiva. Questa procedura incrementa la sicurezza crittografica. 

```typescript
export const randomSalt = () => crypto.randomBytes(128).toString("base64");
export const hashPwd = (salt: string, pwd: string) => {
  return crypto
    .createHmac("sha256", [salt, pwd].join("/"))
    .update(config.HASH_SECRET)
    .digest("hex");
};
```

Si può illustrare questa situazione attraverso un esempio pratico: considerando la password "`qwerty1234#`" e due *salt* differenti, il processo di hash produrrà risultati differenti:

- utente Foo: `b996350795a5ceb13cdd64033bfea805fb70ab30b94d0e6c2fcfec69d89bcb00`
- utente Barr: `29c1f09c396c62e1759a73d5331723c5c72df4ce93c7e56ef449afb94403af17`



Nel processo di login, le credenziali dell'utente, come l'email e la password, vengono verificate. Se la password, sottoposta nuovamente ad hash, corrisponde ai dati memorizzati, un *token* viene creato utilizzando un ulteriore "*salt*" e l'ID dell'utente, contribuendo a rafforzare la sicurezza e l'identificazione dell'utente autenticato. In seguito, il client assumerà la responsabilità di conservare il *token* all'interno dello store dell'applicazione. 

```typescript
...
const salt = randomSalt();
user.auth.sessionToken = hashPwd(salt, user._id.toString());
await user.save();

res.setHeader("SNM-AUTH", user.auth.sessionToken);

return res.status(200).json(user).end();
...
```

#### Accesso endpoint protetti

Nel contesto delle interazioni con l'API, gran parte degli endpoint è soggetta a una protezione tramite autenticazione, il cui controllo è affidato al middleware denominato `isAuthenticated`. Questo middleware si incarica di verificare la presenza del token nell'header della richiesta (`SNM-AUTH`) e di effettuare la validazione dell'utente associato al token stesso.

```typescript
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.header("SNM-AUTH");

    if (!sessionToken) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.status(403).json({ message: "Session expired" });
    }

    req.identity = existingUser;
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
```

Oltre all'autenticazione, molti degli endpoint richiedono un ulteriore livello di controllo, in particolare per dichiarare la "possessione" di una risorsa o per ottenere l'autorizzazione alla modifica di una risorsa specifica. Questi aspetti vengono gestiti attraverso endpoint appositi. Questo processo di gestione delle autorizzazioni si basa su un sistema di verifica che valuta il legame tra l'utente e la risorsa in questione, garantendo che solo gli utenti autorizzati possano accedere e operare su determinate risorse.

```typescript
export const isPlaylistAuthor = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.identity._id;

    if (!id) {
      return res.status(400).json({ message: "Playlist id is required" });
    }

    const playlist = await getPlaylistById(id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (playlist.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not the author of the playlist",
      });
    }

    req.playlist = playlist;
    next();
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
```

Di seguito un esempio di endpoint non protetto e protetto:

- Non protetto:

  ```typescript
  authRouter.post("/auth/register", register);
  ```

- Protetto:

  ```typescript
  playlistRouter.patch(
    "/playlists/:id",
    isAuthenticated,
    isPlaylistAuthor,
    editPlaylist
  );
  ```

#### Accesso alle pagine web protette

All'interno dell'applicazione, si è stabilito che le pagine accessibili senza la necessità di autenticazione siano esclusivamente quelle relative alla registrazione e al login. Per tutte le altre pagine che richiedono un livello di autenticazione, è stato implementato un meccanismo di controllo preventivo. Prima di consentire qualsiasi navigazione a tali pagine, si verifica la validità del *token* dell'utente, qualora presente. Questa verifica viene eseguita utilizzando l'endpoint denominato `api/auth/verify`. In tal modo, si garantisce che solamente gli utenti con *token* validi abbiano l'autorizzazione a accedere alle pagine riservate.

```typescript
// Router
router.beforeEach(async (to, _from) => {
  const nextPage = getByRoute(to);

  if (nextPage?.meta?.requiresAuth) {
    const $user = useUserStore();
    const isValid = await $user.verify();
    if (!isValid) {
      router.push({ name: "login" });
    }
  }
});
```

```typescript
// User Store
...
async verify(): Promise<boolean> {
      if (!this.token) return false;

      try {
        const res = await axios.get("/auth/verify", {
          headers: {
            "SNM-AUTH": this.token,
          },
        });
		...
}
...
```

### Comunicazione e gestione token Spotify
