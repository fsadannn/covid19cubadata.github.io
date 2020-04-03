var domains = {
		'cu': 'Cuba',
		'it': 'Italia',
		'be': 'Bélgica',
		'us': 'USA',
		'fr': 'Francia',
		'ca': 'Canadá',
		'es': 'España',
		'cn': 'China',
		'ru': 'Rusia',
		'uy': 'Uruguay',
		'do': 'R.Dominicana',
		'hr': 'Croacia',
		'co': 'Colombia'
	};

var contagio = {
	'importado': 0,
	'introducido': 0,
	'autoctono': 0,
	'desconocido': 0	
}

$.getJSON("data/paises-info-dias.json", function(countriesdays){

	curves2 = {};

	var countrysorted2 = [];

	function scaleX(num){
		//return num;
		if(num==0){
			return 0;
		}
		return Math.log10(num);
	}
	function scaleY(num){
		if(num==0){
			return 0;
		}
		//return num;
		return Math.log10(num);
	}

	for(var c in countriesdays.paises){
		//console.log(c);
		var total=0;
		var cont=1;
		var weeksum=0;
		var weeks=[c];
		var accum=['Confirmados-'+c];
		for(var i=1;i<countriesdays.paises[c].length;i++){
			total+=countriesdays.paises[c][i];
			weeksum+=countriesdays.paises[c][i];
			cont+=1;
			if(cont%7==0){
				weeks.push(scaleY(weeksum));
				weeksum=0;
				accum.push(scaleX(total));
			}
		}
		curves2[c]={'weeks': weeks, 'cummulative_sum':accum};
		countrysorted2.push(c);
	}
	countrysorted2.sort();
	for(var i=0;i<countrysorted2.length;i++){
		var cc = curves2[countrysorted2[i]]['weeks'][0];
		$('#countrycurve2-select').append('<option value="'+cc+'">'+cc+'</option>');
	}
	var countryselected2 = 'China';
	$('#countrycurve2-select').val(countryselected2);

	//console.log(curves2);
	$('#countrycurve2-select').on('change',function(){
		var val = $('#countrycurve2-select').val();
		curve2.unload({ids:countryselected2});
		countryselected2  = val;
		curve2 = c3.generate({
			bindto: "#new-curve",
				data: {
					  x: 'Confirmados-'+countryselected2,
					  columns: [
						curves2[countryselected2]['cummulative_sum'],
						curves2[countryselected2]['weeks']
					  ],
					  type: 'line',
					},
				axis : {
					x : {
						tick: {
							format: d3.format('.2f')
						}
					}
				}
			});
	});

	curve2 = c3.generate({
		bindto: "#new-curve",
			data: {
				  x: 'Confirmados-'+countryselected2,
				  columns: [
					curves2[countryselected2]['cummulative_sum'],
					curves2[countryselected2]['weeks']
				  ],
				  type: 'line',
				},
			axis : {
				x : {
					tick: {
						format: d3.format('.2f')
					}
				}
			}
	});

	columdata = [];
	xaxisdata = {};
	var cont=0;
	for(var i=0;i<countrysorted2.length;i++){
		xaxisdata[countrysorted2[i]]='Confirmados-'+countrysorted2[i];
		columdata.push(curves2[countrysorted2[i]]['weeks']);
		columdata.push(curves2[countrysorted2[i]]['cummulative_sum']);

		//if(cont==3){break;}
		cont+=1;
	}

	curve3 = c3.generate({
		bindto: "#new-curve2",
			data: {
					xs: xaxisdata,
					columns: columdata,
					type: 'line',
				},
			axis : {
				x : {
					tick: {
						format: d3.format('.1f')
					}
				}
			}
	});

});