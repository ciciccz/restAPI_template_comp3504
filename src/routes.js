"use strict";

module.exports.register = (app, database) => {

    app.get('/', async (req, res) => {
        res.status(200).send("This is running!").end();
    });

    app.get('/api/item', async (req, res) => {

        const itemName = req.query.name;

        if (!itemName) {

            query = database.query('SELECT * FROM item');

            const records = await query;

            res.status(200).send(JSON.stringify(records)).end();
        }

        query = `SELECT * FROM item WHERE LOWER(name) = LOWER(?)`

        sendJson(query, itemName);

    });

    app.get('/api/item/:id', async (req, res) => {

        const itemId = req.params.id;

        if (!itemId) {
            return res.status(400).send('Item ID is required').end();
        }

        let query = `SELECT * FROM item where id = ?`;

        sendJson(query, itemId);

    });

    app.post('/api/item', async (req, res) => {

        const { Id, Name, Quantity, Price, Supplier_id } = req.body;

        if (Id == null || !Name || Quantity == null || Price == null || Supplier_id == null) {
            return res.status(400).send('Id, Name, Quantity, Price, and Supplier_id are required').end();
        }

        try {
            const query = `INSERT INTO item (Id, Name, Quantity, Price, Supplier_id) VALUES (?, ?, ?, ?, ?)`;
            const result = await database.query(query, [Id, Name, Quantity, Price, Supplier_id]);

            if (result.affectedRows) {
                res.status(201).send(`new item with ${Id} is created`);
            } else {
                throw new Error('Insert failed, no rows affected.');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating the item').end();
        }
    }
    );

    app.put('/api/item', async (req, res) => {

        const { Id, Name, Quantity, Price, Supplier_id } = req.body;

        if (Id == null || !Name || Quantity == null || Price == null || Supplier_id == null) {
            return res.status(400).send('Id, Name, Quantity, Price, and Supplier_id are required').end();
        }

        try {
            const query = `UPDATE item SET Name = ?, Quantity = ?, Price = ?, Supplier_id = ? WHERE Id = ?`;
            const result = await database.query(query, [Name, Quantity, Price, Supplier_id, Id]);

            if (result.affectedRows === 0) {
                // No rows affected means the item with the given Id doesn't exist
                return res.status(404).send(`Item with ID ${Id} not found`).end();
            } else {
                res.status(200).send(`Item with ID ${Id} updated successfully`);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating the item').end();
        }
    }
    );
};

sendJson = async (query, param) => {

    try {
        const results = await database.query(query, param);

        if (results.length === 0) {
            return res.status(404).send('Item not found').end();
        }

        res.status(200).send(JSON.stringify(results[0])).end(); // Send the first item found as a response
    } catch (error) {
        res.status(500).send(error).end();
    }
}
