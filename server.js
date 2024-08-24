const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');

const PORT = process.env.TEST_PORT || 4001;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(errorHandler());

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})

const envelopes = require('./envelopes')
const envelopesRouter = express.Router();

app.use('/envelopes', envelopesRouter)

envelopesRouter.param('categoryName', (req, res, next, categoryName) => {
    const { category, budget } = req.body
    if (!category || !budget) {
       next(error);
    } else {
        const index = envelopes.findIndex(envelope =>
            envelope.category === categoryName)
        if (index !== -1) {
            req.index = index
            next();
        } else {
            res.sendStatus(404)
        }
    }
})

// fetch all envelopes
envelopesRouter.get('/', (req, res, next) => {
    res.send({ envelopes: envelopes });
})

// Add an envelope
envelopesRouter.post('/', (req, res, next) => {
    const { category, budget } = req.body
    if (!category || !budget) {
        res.status(400)
    } else {
        res.status(201).send(req.body);
    }
})

// Update an envelope
envelopesRouter.put('/:categoryName', (req, res, next) => {
    envelopes[req.index] = req.body
    res.status(200).send(envelopes[req.index])
})

// delete an envelope
envelopesRouter.delete('/:categoryName', (req, res, next) => {
    envelopes.splice(req.index, 1)
    res.status(200).send(envelopes)
})