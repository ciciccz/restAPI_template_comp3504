"use strict";

module.exports.register = (app, database) => {

    app.get('/', async (req, res) => {
        res.status(200).send("This is running!").end();
    });

    app.get('/api/item', async (req, res) => {
        let query;
        query = database.query('SELECT * FROM item');

        const records = await query;

        res.status(200).send(JSON.stringify(records)).end();
    });

    app.get('/api/item/:id', async (req, res) => {

        const itemId = req.params.id;

        if (!itemId) {
            return res.status(400).send('Item ID is required').end();
        }

        let query;


        try {
            query = `SELECT * FROM item where id = ?`;            // SQL query
            const results = await database.query(query, [itemId]); // Execute the query with the ID as a parameter

            if (results.length === 0) {
                return res.status(404).send('Item not found').end();
            }

            res.status(200).send(JSON.stringify(results[0])).end(); // Send the first item found as a response
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while fetching the item').end();
        }
    });

    app.get('/api/item', async (req, res) => {

        const itemName = req.query.name;

        if (!itemName) {
            return res.status(400).send('Item name is required').end();
        }

        let query;

        try {
            query = `SELECT * FROM item WHERE LOWER(name) = LOWER(?)`;            // SQL query
            const results = await database.query(query, [itemName]); // Execute the query with the ID as a parameter

            if (results.length === 0) {
                return res.status(404).send('Item not found').end();
            }

            res.status(200).send(JSON.stringify(results[0])).end(); // Send the first item found as a response
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while fetching the item').end();
        }
    });

};
