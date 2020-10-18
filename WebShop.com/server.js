var express = require('express');
var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('phones.db');

app.use(express.static('./static'));




app.get('/api/fetchAll', (req,res) => {
	db.all('SELECT id FROM products', (err,rows) => {
		const allProductIds = rows.map(e => e.id);
		res.send(allProductIds);
	});
});


app.get('/api/fetch', (req,res) => {
	db.all('SELECT * FROM products', (err,rows) => {
		const allPhoneModels = rows;
		res.send(allPhoneModels);
	});
});


app.get('/api/get/:phoneId', (req,res) => {
	const idToCheck = req.params.phoneId;
	db.all(
		"SELECT * FROM products WHERE id=$id",
		{
			$id: idToCheck,
		},
		(err,rows) => {
			if(rows.length > 0){
				res.send(rows[0]);
			}
			else{
				res.send({});
			}
		}
	);
});





app.delete('/api/delete', (req,res) => {
	db.run("DELETE FROM products WHERE id=$id;",
		{
			$id: req.body.id,
		},
		(err) => {
			if(err){
				res.send({message: 'error in app.delete(/api/delete)'});
			}
			else{
				res.send({message: 'successfully executed app.delete(/api/delete)'});
			}
		}
	);
});

app.post('/api/create', (req,res) => {
	db.run("INSERT INTO products (image, brand, model, os, screensize) VALUES ($image, $brand, $model, $os, $screensize)", 
		{	
			$image: req.body.image,
			$brand: req.body.brand.toUpperCase(),
			$model: req.body.model.toUpperCase(),
			$os: req.body.os.toUpperCase(),
			$screensize: req.body.screensize,
		},
		(err) => {
			if(err){
				res.send({message: 'error in app.post(/api/create)'});
			}
			else{
				res.send({message: 'successfully executed app.post(/api/create)'});
			}
		}
	);
});



app.put('/api/update', (req, res) => {
	db.run("UPDATE products SET image=$image, brand=$brand, model=$model, os=$os, screensize=$screensize WHERE id=$id",
		{
			$id: req.body.id,
			$image: req.body.image,
			$brand: req.body.brand.toUpperCase(),
			$model: req.body.model.toUpperCase(),
			$os: capitalize(req.body.os.toUpperCase()),
			$screensize: req.body.screensize,
		},
		(err) => {
			if(err){
				res.send({message: 'error in api.put(/api/update)'});
			}
			else{
				res.send({message: 'successfully executed app.put(/api/update)'});
			}
		}
	);
});


app.delete('/api/reset', (req,res) => {
	db.run("DELETE FROM products",
		(err) => {
			if(err){
				res.send({message: 'error in app.delete(/api/reset)'});
			}
			else{
				res.send({message: 'successfully executed app.delete(/api/reset)'});
			}
		}
	);
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}`));





const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}