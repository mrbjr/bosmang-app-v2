var user_database_js = [
	{
		name: 'Marcos',
		passw: '42',
		email: 'mrbjr@outlook.com',
		prof: 'default',
		bg: '2',
	},
	{
		name: 'Visitante',
		passw: 'guest',
		email: 'guest@br.com',
		prof: 'default',
		bg: '3',
	},
	{
		name: 'Matheus',
		passw: 'guest',
		email: 'matheusvb2@gmail.com',
		prof: 'default',
		bg: '3',
	  },
	  {
		name: 'Visitante Livre',
		passw: '',
		email: 'visitante',
		prof: '',
		bg: '3',
		}
  ]

  var materials = [
	{
		categ: 'heavy',
		name: 'Concreto',
		brand: 'ISO 12354-1:2017',
		density: 2200,
		ym: undefined,
		pm: undefined,
		wave: 3800,
		loss: 0.005,
		ide: 1,
	},
	{
		categ: 'float',
		name: 'Piso Zero',
		brand: 'zero',
		density: 0,
		ym: 0,
		tp: 'sand', //sand ou asphalt
		ide: 2,
	},
	{
		categ: 'heavy',
		name: 'Calcium-silicate blocks',
		brand: 'ISO 12354-1:2017',
		density: 1800,
		ym: undefined,
		pm: undefined,
		wave: 2500,
		loss: 0.01,
		ide: 3,
	},
	{
		categ: 'heavy',
		name: 'Autoclaved aerated concrete blocks',
		brand: 'ISO 12354-1:2017',
		density: 800,
		ym: undefined,
		pm: undefined,
		wave: 1900,
		loss: 0.0125,
		ide: 4,
	},
	{
		categ: 'heavy',
		name: 'Lightweight aggregate blocks',
		brand: 'ISO 12354-1:2017',
		density: 1400,
		ym: undefined,
		pm: undefined,
		wave: 2200,
		loss: 0.01,
		ide: 5,
	},
	{
		categ: 'heavy',
		name: 'Dense aggregate blocks',
		brand: 'ISO 12354-1:2017',
		density: 2000,
		ym: undefined,
		pm: undefined,
		wave: 2700,
		loss: 0.01,
		ide: 6,
	},
	{
		categ: 'heavy',
		name: 'Bricks',
		brand: 'ISO 12354-1:2017',
		density: 2000,
		ym: undefined,
		pm: undefined,
		wave: 2700,
		loss: 0.01,
		ide: 7,
	},
	{
		categ: 'heavy',
		name: 'Plasteboard (natural gypsum)',
		brand: 'ISO 12354-1:2017',
		density: 860,
		ym: undefined,
		pm: undefined,
		wave: 1490,
		loss: 0.0141,
		ide: 8,
	},
	{
		categ: 'heavy',
		name: 'Plasteboard (flue gas and natural gypsum)',
		brand: 'ISO 12354-1:2017',
		density: 680,
		ym: undefined,
		pm: undefined,
		wave: 1810,
		loss: 0.0125,
		ide: 9,
	},
	{
		categ: 'heavy',
		name: 'Chipboard',
		brand: 'ISO 12354-1:2017',
		density: 760,
		ym: undefined,
		pm: undefined,
		wave: 2200,
		loss: 0.01,
		ide: 10,
	},
	{
		categ: 'heavy',
		name: 'Autoclaved aerated concrete blocks',
		brand: 'ISO 12354-1:2017',
		density: 600,
		ym: undefined,
		pm: undefined,
		wave: 1900,
		loss: 0.0125,
		ide: 11,
	},
	{
		categ: 'float',
		name: 'Lã mineral genérica (s=8)',
		brand: 'ISO 12354-1:2017',
		density: 2100,
		ym: 8,
		tp: 'sand', //sand ou asphalt
		ide: 12,
	},
	{
		categ: 'heavy',
		name: 'Brickwork',
		brand: 'ISO 12354-2:2000',
		density: 1900,
		ym: undefined,
		pm: undefined,
		wave: 2200,
		loss: 0.0125,
		ide: 13,
	},
	{
		categ: 'float',
		name: 'Lã asfáltica genérica (s=8)',
		brand: 'ISO 12354-2:2000',
		density: 4000,
		ym: 8,
		tp: 'asphalt', //sand ou asphalt
		ide: 14,
	},
	{
		categ: 'heavy',
		name: 'Concreto 2300',
		brand: 'ISO 12354-2:2000',
		density: 2300,
		ym: undefined,
		pm: undefined,
		wave: 3500,
		loss: 0.006,
		ide: 15,
	},
	{
		categ: 'heavy',
		name: 'A15+PA140+A15/170mm',
		brand: 'KERBER:2021',
		density: 986,
		ym: undefined,
		pm: undefined,
		wave: 2360,
		loss: 0.01,
		ide: 16,
	},
	{
		categ: 'heavy',
		name: 'A25+PA140+A15/180mm',
		brand: 'KERBER:2021',
		density: 1013,
		ym: undefined,
		pm: undefined,
		wave: 2330,
		loss: 0.01,
		ide: 17,
	},
	{
		categ: 'heavy',
		name: 'A25+PA140+A25/190mm',
		brand: 'KERBER:2021',
		density: 1037,
		ym: undefined,
		pm: undefined,
		wave: 2300,
		loss: 0.01,
		ide: 18,
	},
	{
		categ: 'heavy',
		name: 'A25+PA140+G10/175mm',
		brand: 'KERBER:2021',
		density: 961,
		ym: undefined,
		pm: undefined,
		wave: 2335,
		loss: 0.01,
		ide: 19,
	},
	{
		categ: 'heavy',
		name: 'G10+PA140+G10/160mm',
		brand: 'KERBER:2021',
		density: 870,
		ym: undefined,
		pm: undefined,
		wave: 2513,
		loss: 0.01,
		ide: 20,
	},
	{
		categ: 'float',
		name: 'FlexSilenzio PE (5mm)',
		brand: 'Acital',
		density: 20,
		ym: 52,
		tp: 'asphalt', //sand ou asphalt
		ide: 21,
	},
	{
		categ: 'float',
		name: 'FlexSilenzio PE (10mm)',
		brand: 'Acital',
		density: 20,
		ym: 28,
		tp: 'asphalt', //sand ou asphalt
		ide: 22,
	},
	{
		categ: 'heavy',
		name: 'L11/110mm',
		brand: 'KERBER:2021',
		density: 2010,
		ym: undefined,
		pm: undefined,
		wave: 3900,
		loss: 0.0125,
		ide: 23,
	},
	{
		categ: 'heavy',
		name: 'L11+PC7b/117mm',
		brand: 'KERBER:2021',
		density: 2100,
		ym: undefined,
		pm: undefined,
		wave: 3900,
		loss: 0.0125,
		ide: 24,
	},
	{
		categ: 'float',
		name: 'FlexSilenzio PP (2mm)',
		brand: 'Acital',
		density: 42,
		ym: 86,
		tp: 'asphalt', //sand ou asphalt
		ide: 25,
	},
	{
		categ: 'heavy',
		name: 'G10+PA90+G10/110mm',
		brand: 'LACAF:2017',
		density: 865,
		ym: undefined,
		pm: undefined,
		wave: 2375, //2520
		loss: 0.01,
		ide: 26,
	},
	{
		categ: 'heavy',
		name: 'G10+PA140+G10/160mm',
		brand: 'LACAF:2017',
		density: 870,
		ym: undefined,
		pm: undefined,
		wave: 2510,
		loss: 0.01,
		ide: 27,
	},
	{
		categ: 'heavy',
		name: 'G10+PA190+G10/210mm',
		brand: 'LACAF:2017',
		density: 873,
		ym: undefined,
		pm: undefined,
		wave: 2510, // 2510
		loss: 0.01,
		ide: 28,
	},
	{
		categ: 'heavy',
		name: 'L12+A5/170mm',
		brand: 'LACAF:2017',
		density: 2209,
		ym: undefined,
		pm: undefined,
		wave: 3265,
		loss: 0.01,
		ide: 29,
	},
	{
	categ: 'heavy',
	name: 'PCo/100mm',
	brand: 'KERBER:2021',
	density: 2206,
	ym: undefined,
	pm: undefined,
	wave: 2544,
	loss: 0.01,
	ide: 30,
},
{
	categ: 'heavy',
	name: 'L11+PC7a/117mm',
	brand: 'KERBER:2021',
	density: 2300,
	ym: undefined,
	pm: undefined,
	wave: 3500,
	loss: 0.0125,
	ide: 31,
},
{
	categ: 'heavy',
	name: 'PL7/7mm',
	brand: 'KERBER:2021',
	density: 800,
	ym: undefined,
	pm: undefined,
	wave: 0,
	loss: 0,
	ide: 32,
},
{
	categ: 'float',
	name: 'MPEc (2,5mm)',
	brand: '-',
	density: 42,
	ym: 10,
	tp: 'asphalt', //sand ou asphalt
	ide: 33,
},
{
	categ: 'float',
	name: 'MPEd (2,5mm)',
	brand: '-',
	density: 42,
	ym: 13,
	tp: 'asphalt', //sand ou asphalt
	ide: 34,
},
  ]

  var systems = [
	{
		name: 'CLT genérico: por nome das camadas',
		brand:'ISO 12354-2:2017',
		desc: 'descrição do sistema',
		transm: 'whole',
		type: 'clt',
		fc: 2000,
		R: [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
		Ln: [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
		categ: 'wall',
	},
	{
		name: 'Wood frame generic',
		brand: 'ISO 12354-1:2017',
		desc: 'dry floating screed system-----------; \n 18mm OBS; \n pregos 45mm x 220mm / 40cm; \n cavidade 100mm lã mineral; \n placa metalica suspensa com 2x13mm placas de gesso',
		transm: 'inner',
		type: 'wframe',
		fc: 1971,
		R: [10.1,10.2,10.3,10.4,10.5,10.6,10.7,10.8,10.9,10.0,10.1,10.2,10.3,10.4,10.5,10.6,10.7,10.8,10.9,10.0,10.1],
		Ln: [10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
		categ: 'floor',
	},

  ]

export default {user_database_js,materials,systems}; 