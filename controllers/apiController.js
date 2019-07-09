const express 		= require('express');
const router 		= express.Router();

// API Get Route

router.get('/', async (req, res) => {
	try {
		const parks = await fetch(process.env.API);
        const parksJson = await parks.json();
        JSON.stringify(parksJson);
		res.json({
			status: 200,
			data: parksJson
		});

	} catch(err){
		res.json(err)
	}
})

module.exports = router;