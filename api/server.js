import { createRequire } from 'module';
import express from 'express';
import bodyParser from 'body-parser';
import base64 from 'base-64';
import cors from 'cors';
import _ from 'lodash';

const { decode, encode } = base64;
const { urlencoded } = bodyParser;
const { shuffle } = _;

const require = createRequire(import.meta.url);
const app = express();

const dogFacts = require('./dog-facts');
const pokemon = require('./pokemon');

const pokemonMetadata = pokemon.map(({ name, classification, id }, index) => ({
  id,
  name,
  classification,
}));

app.use(cors());
app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(express.static('public'));

app.get('/', (request, response) => {
  response.redirect('/api/pokemon');
});

const withChaos = (request, response, next) => {
  let delay = parseInt(request.query.delay || 0, 10);
  let flakiness = parseInt(request.query.flakiness || 0, 10);
  let chaos = !!request.query.chaos;

  if (chaos) delay = (delay + 1) * Math.random() + 1000;

  if (flakiness && Date.now() % flakiness === 0) {
    response.status(500);
    return response.json({ error: 'Something went wrong.' });
  }

  setTimeout(next, delay);
};

app.get('/api/pokemon/search', withChaos, (request, response) => {
  response.json({ pokemon: [] });
});

app.get('/api/pokemon/search/:query', withChaos, (request, response) => {
  let query = request.params.query && request.params.query.toLowerCase();

  let page = request.query.page ? parseInt(decode(request.query.page)) : 0;

  let limit = +request.query.limit || 10;

  let matching = pokemonMetadata.filter(({ name }) =>
    name.toLowerCase().startsWith(query),
  );

  let selection = matching.slice(page, page + limit);

  let nextPage = matching[page + limit + 1]
    ? encode(page + limit + 1)
    : undefined;

  response.json({
    pokemon: selection,
    nextPage,
  });
});

app.get('/api/pokemon/:id', withChaos, (request, response) => {
  const id = parseInt(request.params.id, 10);
  response.json(pokemon[id - 1]);
});

app.get('/api/pokemon', withChaos, (request, response) => {
  let page = request.query.page ? parseInt(decode(request.query.page)) : 0;
  let limit = parseInt(request.query.limit, 10) || 10;

  let selection = pokemonMetadata.slice(page, page + limit);
  let nextPage = pokemon[page + limit + 1]
    ? encode(page + limit + 1)
    : undefined;

  const token = nextPage ? encodeURIComponent(nextPage) : null;

  response.json({
    pokemon: selection,
    nextPage: token,
  });
});

app.get('/api/facts', withChaos, (request, response) => {
  let count = parseInt(request.query.count || 3, 10);
  response.json({
    facts: shuffle(dogFacts).slice(0, count),
  });
});

app.get('/api/facts/:id', withChaos, (request, response) => {
  response.json({
    fact: dogFacts[request.params.id],
  });
});

const listener = app.listen(process.env.PORT || 3333, () => {
  console.log(`Your app is listening on port ${listener.address().port}.`);
});
