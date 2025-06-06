// ----------
// Packing:
// submodules/clock/clock.js
// =var fbFriends=
// test/fakeFriends.json
// =;
// =var fbid2zid=
// test/fakeZidMap.json
// =;
// test/fakeDataInjector.js
// =clock.noConflict();
// test/init.js
// test/checkForDAPI.js
// ----------

// Begin submodules/clock/clock.js
/*global global, module*/
(function () {

	// Make a module
	var clock = (function (name) {
		var rt = typeof window !== 'undefined' ? window : global,
			had = rt.hasOwnProperty(name), prev = rt[name], me = rt[name] = {};
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = me;
		} //submodules/clock/clock.js:10//
		me.noConflict = function () {
			delete rt[name];
			if (had) {
				rt[name] = prev;
			}
			return this;
		};
		return me;
	}('clock'));
 //submodules/clock/clock.js:20//
	clock.VERSION = '0.0.6';

	// Convenience methods
	var slice = Array.prototype.slice;
	function now() {
		return new Date();
	}

	clock.session = function () {
		var //submodules/clock/clock.js:30//
			counters = {},
			log = [],
			root = typeof window !== 'undefined' ? window : global,
			master = arguments[0] || root,
			me,
			paused,
			slaves = [],
			stop,
			timers = {}
		; //submodules/clock/clock.js:40//

		function clear(timer) {
			delete timers[timer];
			return master.clearTimeout(timer);
		}

		// This function is adapted from underscore.js
		function limit(func, wait, debounce) {
			var timeout;
			return function () { //submodules/clock/clock.js:50//
				var context = this, args = arguments;
				var throttler = function () {
					timeout = null;
					func.apply(context, args);
				};
				if (debounce) {
					me.clearTimeout(timeout);
				}
				if (debounce || !timeout) {
					timeout = me.setTimeout(throttler, wait); //submodules/clock/clock.js:60//
				}
			};
		}

		function setTimer(timerFunc, func, ms) {
			if (stop) {
				return;
			}
			var t = timerFunc(function () {
				if (stop) { //submodules/clock/clock.js:70//
					return;
				} else if (paused) {
					paused.push(func);
				} else {
					return func.apply({}, arguments);
				}
			}, ms || 0);
			timers[t] = true;
			return t;
		} //submodules/clock/clock.js:80//

		me = {

			clearInterval: clear,
			clearTimeout: clear,

			debounce: function (func, wait) {
				return limit(func, wait, true);
			},
 //submodules/clock/clock.js:90//
			increment: function (counter) {
				var i = -1, len = arguments.length;
				while (++i < len) {
					counter = arguments[i];
					if (!counters.hasOwnProperty(counter)) {
						counters[counter] = 0;
					}
					counters[counter]++;
				}
			}, //submodules/clock/clock.js:100//

			log: function () {
				if (arguments.length) {
					log.push([now()].concat(slice.call(arguments)));
				}
				return log;
			},

			pause: function () {
				if (!paused) { //submodules/clock/clock.js:110//
					paused = [];
				}
			},

			poller: function (func, min, max) {
				var p = {}, timer, lastPoll = 0;
				p.poll = function () {
					var currentTime = now();
					if (currentTime - lastPoll >= min) {
						me.clearTimeout(timer); //submodules/clock/clock.js:120//
						lastPoll = currentTime;
						func();
						if (max < Infinity) {
							timer = me.setTimeout(p.poll, max);
						}
					}
				};
				p.die = function () {
					min = Infinity;
					me.clearTimeout(timer); //submodules/clock/clock.js:130//
				};
				if (max < Infinity) {
					timer = me.setTimeout(p.poll, max);
				}
				return p;
			},

			session: function () {
				var slave = clock.session({
					clearInterval: me.clearInterval, //submodules/clock/clock.js:140//
					clearTimeout: me.clearInterval,
					setInterval: me.setInterval,
					setTimeout: me.setTimeout
				});
				slaves.push(slave);
				return slave;
			},

			setInterval: function (func, ms) {
				return setTimer(master.setInterval, func, ms); //submodules/clock/clock.js:150//
			},

			setTimeout: function (func, ms) {
				return setTimer(master.setTimeout, func, ms);
			},

			stop: function () {
				stop = now();
				for (var t in timers) {
					if (timers.hasOwnProperty(t)) { //submodules/clock/clock.js:160//
						me.clearTimeout(t);
					}
				}
			},

			tally: function (counter) {
				var args = arguments, i = -1, len = args.length, results = {}, c;
				switch (args.length) {
				case 0:
					for (c in counters) { //submodules/clock/clock.js:170//
						if (counters.hasOwnProperty(c)) {
							results[c] = counters[c];
						}
					}
					break;
				case 1:
					return counters[counter];
				default:
					while (++i < len) {
						counter = args[i]; //submodules/clock/clock.js:180//
						results[counter] = counters[counter];
					}
				}
				return results;
			},

			throttle: function (func, wait) {
				return limit(func, wait, false);
			},
 //submodules/clock/clock.js:190//
			unpause: function () {
				var i, len;
				if (paused) {
					for (i = 0, len = paused.length; i < len; i++) {
						me.setTimeout(paused[i], 0);
					}
				}
				paused = false;
			}
		}; //submodules/clock/clock.js:200//
		return me;
	};

}());

// End submodules/clock/clock.js


// Begin =var fbFriends=
var fbFriends =

// End =var fbFriends=


// Begin test/fakeFriends.json
[{"name":"Timothy  Thairu","id":"3925"},{"name":"Ilias Beshimov","id":"24598"},{"name":"Craig Lancaster","id":"29380"},{"name":"Isaac Silverman","id":"105689"},{"name":"Bart Decrem","id":"217871"},{"name":"Anthony Young","id":"314225"},{"name":"Geoffrey Arone","id":"707888"},{"name":"Mike Shim","id":"1000969"},{"name":"Janete Perez","id":"1003672"},{"name":"Kyle Warren","id":"1005320"},{"name":"Zach Shubert","id":"1008358"},{"name":"Michael Zaret","id":"1104848"},{"name":"Mark M Towfiq","id":"1106449"},{"name":"Jason S. McGuirk","id":"1215007"},{"name":"Mike Kampel","id":"2010395"},{"name":"Dan Burkhart","id":"2535641"},{"name":"Jacob Rosenberg","id":"3007441"},{"name":"Thomas Tran","id":"3200156"},{"name":"Will Harbin","id":"4711515"},{"name":"Peter Andrews","id":"5407980"},{"name":"Evan Hamilton","id":"6707094"},{"name":"Neil Roseman","id":"8226419"},{"name":"Jonathan Chum","id":"12804039"},{"name":"Houston Law","id":"15108661"},{"name":"Taylor Whitney","id":"20902433"},{"name":"Jaron Easterbrook","id":"28105373"},{"name":"Heathir Christine","id":"58013514"},{"name":"Mathew Campbell","id":"58016200"},{"name":"Steven J Garner","id":"71804306"},{"name":"Megan Williams","id":"116202916"},{"name":"Matt Williams","id":"116205141"},{"name":"Rajesh Kumar","id":"122605732"},{"name":"Pawel Gieniec","id":"122613502"},{"name":"Phil Hancyk","id":"127900102"},{"name":"Diana Watters","id":"172002213"},{"name":"Matt Pelham","id":"174800006"},{"name":"Josh Campbell","id":"187901952"},{"name":"Ian McKellar","id":"219500090"},{"name":"Mike Lin","id":"500010087"},{"name":"Erwan Loisant","id":"500010509"},{"name":"Andy Smith","id":"500012624"},{"name":"Robin Slomkowski","id":"500012744"},{"name":"Lloyd Dewolf","id":"500013127"},{"name":"Daryl L. L. Houston","id":"500013626"},{"name":"Divya Shah","id":"500020275"},{"name":"Michael Dosik","id":"500036144"},{"name":"Patricia B","id":"500045956"},{"name":"Erikka Arone","id":"500066908"},{"name":"Rafael Ebron","id":"501265890"},{"name":"Clayton Stark","id":"501546012"},{"name":"Eric Gustav Spilkovski","id":"501571534"},{"name":"Richard Phan","id":"501682370"},{"name":"Julea Campbell","id":"502301153"},{"name":"Chris Messina","id":"502411873"},{"name":"Rebecca Obedkoff","id":"502425131"},{"name":"Aaron Dragushan","id":"502592590"},{"name":"Melissa Nagy","id":"503089224"},{"name":"Jacky Zhang","id":"503612290"},{"name":"Mike Cliff","id":"504491041"},{"name":"Paul Adam","id":"505024602"},{"name":"Joshua McKenty","id":"506628630"},{"name":"Lacey Salet","id":"506667136"},{"name":"Matthew Willis","id":"506749194"},{"name":"Joelle Blaikie","id":"506766617"},{"name":"Quaelin Quasar","id":"507031377"},{"name":"Ishika Srawan","id":"507691193"},{"name":"Caley Campbell","id":"508499222"},{"name":"Adam Schelle","id":"508839112"},{"name":"Cameron Wigmore","id":"508955859"},{"name":"Brian Oraas","id":"510626438"},{"name":"Joanie McCollom","id":"511217568"},{"name":"Lisa Zak","id":"511557695"},{"name":"Sasha Djakovic","id":"511573683"},{"name":"Brij Charan","id":"511664568"},{"name":"Thuy Vu","id":"511784873"},{"name":"Laine S","id":"511805713"},{"name":"Haley Campbell","id":"513441928"},{"name":"Lisa McKenzie Bergot","id":"513730915"},{"name":"Naomi Costain","id":"513871303"},{"name":"Greg Lewis","id":"515197243"},{"name":"Thomas Omd","id":"515576668"},{"name":"Sam Amos","id":"515940424"},{"name":"Ryan Tomaselli","id":"516078268"},{"name":"Kyle Cook","id":"516098147"},{"name":"Kris Degaust","id":"516198140"},{"name":"Janica Blaikie","id":"516555263"},{"name":"Frieda Kaiser","id":"516614511"},{"name":"Pia Grönqvist","id":"516626841"},{"name":"Erica Kwan","id":"516854896"},{"name":"Jered Blaikie","id":"516868958"},{"name":"Carla Torres","id":"517417846"},{"name":"Brad Lewis","id":"517829231"},{"name":"Raj Paul","id":"517965649"},{"name":"Niema Derakhshan","id":"518376489"},{"name":"Shawn Carl","id":"518615192"},{"name":"Pam Rothstein","id":"520743198"},{"name":"Devi Garner","id":"520916061"},{"name":"Mandell Degerness","id":"521096827"},{"name":"Adam Flesher","id":"521721490"},{"name":"Dianne Bone","id":"522301885"},{"name":"Ted Neustaedter","id":"523757465"},{"name":"Nicole Ttp","id":"523941575"},{"name":"Roger Mundell","id":"524466075"},{"name":"Matthew Skala","id":"524752783"},{"name":"Tom Tran","id":"526099736"},{"name":"Tobias Dunn-Krahn","id":"526191531"},{"name":"Jenny Bulk","id":"526931835"},{"name":"Gregg Danderfer","id":"527822395"},{"name":"Chris Fletcher","id":"530620621"},{"name":"Olivia Zielinski","id":"530830166"},{"name":"Gordon Wilson","id":"531221144"},{"name":"Kevin Pangman","id":"531537186"},{"name":"Naomi Wyman Jones","id":"531665162"},{"name":"Clara Nykodym-Murphy","id":"531976507"},{"name":"Mary Joan","id":"532506336"},{"name":"Raymond Ng","id":"532561875"},{"name":"Neil Johnston","id":"532867245"},{"name":"Shawn Potter","id":"532884803"},{"name":"Tessa Francis","id":"537710244"},{"name":"Orion Zmur","id":"537820121"},{"name":"Jacky Wang","id":"538398814"},{"name":"Glenn R Wichman","id":"538606525"},{"name":"Kim Martin","id":"539160587"},{"name":"Jeff Laird","id":"539271502"},{"name":"Elizabeth Vinkle","id":"539914051"},{"name":"Bruno Calvignac","id":"540106978"},{"name":"Morgan Tedder","id":"540585528"},{"name":"Brant Felker","id":"540821404"},{"name":"Rob Lowe","id":"542614713"},{"name":"Doug Bakewell","id":"544566750"},{"name":"Karen Rivers","id":"544745489"},{"name":"Cait Lin","id":"546900345"},{"name":"Dale Campbell","id":"547935972"},{"name":"Robert Pfuetzenreuter","id":"548784901"},{"name":"Scott Kelly","id":"550435713"},{"name":"Jeff Bishop","id":"553695433"},{"name":"James Legh","id":"553825179"},{"name":"Joshua Holland","id":"554043409"},{"name":"Sally Bennett","id":"554376189"},{"name":"Christa Monasch","id":"554977050"},{"name":"Constantin Koumouzelis","id":"555279551"},{"name":"Chad Lupkes","id":"555380156"},{"name":"Mary Zak","id":"558497222"},{"name":"'Mark Skaggs","id":"560197058"},{"name":"Derek Poitras","id":"560400540"},{"name":"Jam Hamidi","id":"560536804"},{"name":"Ritchie Smith","id":"560795383"},{"name":"Anna Campbell","id":"561121150"},{"name":"Alison Taylor Antonik","id":"562076422"},{"name":"Alan Chu","id":"563265844"},{"name":"Sophie Sam-Laï","id":"563285850"},{"name":"Brittany Saunders","id":"563830645"},{"name":"John T","id":"565785286"},{"name":"Hugh Wellman","id":"568050201"},{"name":"Nicole Vinette","id":"569206415"},{"name":"Karl Swannie","id":"570550867"},{"name":"Tara Hartigan","id":"573384454"},{"name":"Adam Sutherland","id":"573960161"},{"name":"Sue Adam","id":"577750221"},{"name":"Jens Henderson","id":"578026207"},{"name":"Andrew Dennison","id":"579426256"},{"name":"Jerad Daniels","id":"579610713"},{"name":"Bonney King","id":"580696643"},{"name":"Kim Campbell","id":"583321237"},{"name":"Eugene Parks","id":"584454492"},{"name":"Ben Mullin","id":"587150787"},{"name":"Michael Golder","id":"588485165"},{"name":"Daniel Hogg","id":"591245812"},{"name":"Adam Blainey","id":"591735190"},{"name":"Erika Kovacs","id":"592601511"},{"name":"Emma Crowe","id":"593422395"},{"name":"Thomas Isaac King","id":"596116567"},{"name":"Donald Chan","id":"596904781"},{"name":"Bernard White","id":"598317040"},{"name":"Dakota Hovey","id":"598480147"},{"name":"Donna Campbell","id":"600330910"},{"name":"Vishvananda Ishaya","id":"600626097"},{"name":"Kent Berger-North","id":"601486977"},{"name":"Joshua Burgin","id":"601998078"},{"name":"Lisa Kostova Ogata","id":"602470308"},{"name":"Lisa Reda","id":"602626600"},{"name":"Eli Raynie Pearson","id":"603691852"},{"name":"Emma Irwin","id":"603850785"},{"name":"John Rafuse","id":"604294114"},{"name":"Christopher Holt","id":"604721726"},{"name":"Chris Martin","id":"605045477"},{"name":"Stephen Legault","id":"610716469"},{"name":"Noel Burton-Krahn","id":"611258318"},{"name":"Dan Gunn","id":"611336186"},{"name":"Beth Landry","id":"611807562"},{"name":"Raphael Burnes","id":"613151228"},{"name":"Matt Hutchison","id":"613434749"},{"name":"Deanna Coleman","id":"615080580"},{"name":"Meiri Sage","id":"618425684"},{"name":"Oscar Furtado","id":"619170270"},{"name":"어부밥","id":"620501201"},{"name":"Kirk Wilson","id":"621061419"},{"name":"Gerry Haustein","id":"621232328"},{"name":"Ken Campbell","id":"621673036"},{"name":"Rick Tessner","id":"622177208"},{"name":"Jim Harris","id":"622235708"},{"name":"Tom Campbell","id":"622400764"},{"name":"Debi Mitchell Campbell","id":"622797711"},{"name":"Adrienne Fast","id":"625247281"},{"name":"Isa Macdonald","id":"626142196"},{"name":"Adam Kahtava","id":"626870931"},{"name":"Rebecca T Red","id":"627220365"},{"name":"Go Nakamaru","id":"628300499"},{"name":"Graham Barnes","id":"629950268"},{"name":"Matthew Politano","id":"631655258"},{"name":"Jeff Campbell","id":"631725380"},{"name":"Bill Zaalberg","id":"631847616"},{"name":"Mixilplix Xilplixim","id":"633164517"},{"name":"Jarret Morton","id":"633280411"},{"name":"Todd Meynink","id":"634249564"},{"name":"Julian Barabas","id":"636355617"},{"name":"Scott Prelewicz","id":"638940642"},{"name":"Collan Simmons","id":"641047827"},{"name":"Ruth Lloyd","id":"641317793"},{"name":"Patrick Murphy","id":"642047649"},{"name":"Janine Willis","id":"642411807"},{"name":"Karl Varga","id":"643455175"},{"name":"Farid Zamany","id":"646751681"},{"name":"Garry Chan","id":"647170693"},{"name":"Natalie Saunders","id":"647945152"},{"name":"Christopher Hatty","id":"649386267"},{"name":"Geoff Rayner","id":"650526629"},{"name":"Dana Nance","id":"650772142"},{"name":"Francesco Auditore da Firenze","id":"651010103"},{"name":"Jennifer Campbell Williams","id":"651746509"},{"name":"Frank Wang","id":"652248838"},{"name":"Alexandra Morton","id":"652665498"},{"name":"Zbigniew Braniecki","id":"654291354"},{"name":"Brian Gordon","id":"655935000"},{"name":"Richard Vida","id":"656382795"},{"name":"Sean Holman","id":"656552323"},{"name":"Manoj Koushik","id":"658813572"},{"name":"Jordan Blaikie","id":"659575873"},{"name":"Lyn Hunter","id":"660870265"},{"name":"Mike Neal","id":"661406256"},{"name":"Madonna Drogosiewicz","id":"661407039"},{"name":"Jim Peng","id":"661562454"},{"name":"Erik Bethke","id":"662215862"},{"name":"Julian Pye","id":"663147602"},{"name":"Ian Muir","id":"666465936"},{"name":"Tiffany Aitken-Taylor","id":"666540597"},{"name":"Payam Fouladianpour","id":"673320789"},{"name":"Matthew Conrad","id":"675080248"},{"name":"Jim Heller","id":"677060706"},{"name":"Johny Blaikie","id":"677700170"},{"name":"Jae Cooper","id":"681685080"},{"name":"Justin Louie","id":"684095070"},{"name":"Stan Burns","id":"685695550"},{"name":"Chris Coldwell","id":"685820411"},{"name":"Andreas Mertens","id":"686322026"},{"name":"Aaron Gregg","id":"686340315"},{"name":"Susan Campbell","id":"686662270"},{"name":"Howard Campbell","id":"687669549"},{"name":"Mark Lise","id":"689091709"},{"name":"Terence Kwan","id":"689681758"},{"name":"Benedicto Macatangay","id":"690164572"},{"name":"Ben Leather","id":"690285515"},{"name":"Jena Bills","id":"690586860"},{"name":"Leon Carl","id":"690671785"},{"name":"Ted Han","id":"690841560"},{"name":"Bill Stewart","id":"691207203"},{"name":"Melody Sadowy","id":"692266931"},{"name":"Doug Hornsey","id":"692371395"},{"name":"Jaime Dughi","id":"693283369"},{"name":"Scott Travelbea","id":"693960506"},{"name":"Devon Greenway","id":"694131816"},{"name":"Jessy Kate Schingler","id":"695190985"},{"name":"Crispin Murphy","id":"696696572"},{"name":"Jon Kralt","id":"696745940"},{"name":"Steve Rosewarne","id":"697841244"},{"name":"Neil Bradley","id":"697861996"},{"name":"Fineas Gage","id":"698107347"},{"name":"Sang-Kiet Ly","id":"698456005"},{"name":"Michael Milota","id":"699571228"},{"name":"Michael Laine","id":"700400831"},{"name":"Paul Sytsma","id":"702512921"},{"name":"Ajinkya Apte","id":"702795693"},{"name":"Michelle Koh Potts","id":"704583622"},{"name":"Gil Namur","id":"706836839"},{"name":"Rebeca Dunn-Krahn","id":"708395886"},{"name":"Dane R","id":"708815391"},{"name":"Krista Zala","id":"716036832"},{"name":"Christina Wodtke","id":"716290205"},{"name":"Steven Chow","id":"716361400"},{"name":"Jeremy Liew","id":"716390510"},{"name":"Luther MacDonald","id":"718105900"},{"name":"Tim Catlin","id":"719051301"},{"name":"Angela Futcher","id":"719755075"},{"name":"Danna Bridges","id":"720951533"},{"name":"Cam Carmichael","id":"721505271"},{"name":"Fionn Yaxley","id":"722730489"},{"name":"Brooke Murray","id":"722751398"},{"name":"Jeremy Krahn","id":"725000189"},{"name":"Tim Taylor","id":"725763218"},{"name":"Peter Freeman","id":"729157512"},{"name":"Marlena Stubbings","id":"730140157"},{"name":"Trevor Stubbings","id":"731557039"},{"name":"Cathy Key","id":"732486281"},{"name":"Michael Travers","id":"734166232"},{"name":"Madhu Bolton","id":"735562176"},{"name":"Len Kirby","id":"735900528"},{"name":"Garrett Milliron","id":"736038664"},{"name":"Lee McAllister","id":"736630385"},{"name":"Bryan Hudson","id":"737755410"},{"name":"Chris Lamb","id":"737881927"},{"name":"Shawn Hardin","id":"740940061"},{"name":"Mike Bailey","id":"741534292"},{"name":"Kurt Cagle","id":"744681755"},{"name":"Gary Zak","id":"747984712"},{"name":"Manish Singh","id":"748220618"},{"name":"Maureen Ness","id":"748248427"},{"name":"Christy Shook","id":"748475421"},{"name":"Danée Jensen","id":"748526006"},{"name":"Emily Coldwell","id":"749825353"},{"name":"Eric Daman","id":"752145170"},{"name":"Jupiter MacDonald","id":"765955141"},{"name":"Caroline Posynick","id":"767462649"},{"name":"Christopher Campbell","id":"768760054"},{"name":"Jason Davidson","id":"769250701"},{"name":"Sean Pendergast","id":"784913384"},{"name":"George Meyer","id":"788283707"},{"name":"Francis Pintos","id":"788751324"},{"name":"Emre Birol","id":"789179368"},{"name":"Bryce Jensen","id":"789875718"},{"name":"Randy Posynick","id":"790155297"},{"name":"Brian Case","id":"790734358"},{"name":"Claude Cote","id":"791706634"},{"name":"Sean Atombomb McDonnell","id":"793904130"},{"name":"Chris Robb","id":"812015150"},{"name":"Dylan Sproule","id":"814230018"},{"name":"Lee Maddison","id":"817660206"},{"name":"Craig Gulliver","id":"820380376"},{"name":"Jennifer Campbell","id":"824510520"},{"name":"Samara Burnes","id":"827563537"},{"name":"Jen Blaikie","id":"831995471"},{"name":"Elton Pereira","id":"833870500"},{"name":"Matt Rissling","id":"838835159"},{"name":"Julia Dewolf","id":"840680009"},{"name":"Jeremy Baker","id":"844490297"},{"name":"Sarah Campbell","id":"845900018"},{"name":"Betty Campbell","id":"846785250"},{"name":"Eric Yue","id":"848670312"},{"name":"Rachel Calder","id":"849540456"},{"name":"Nicole Hart","id":"855670081"},{"name":"Fraser Stamp-Vincent","id":"859350552"},{"name":"Howard Campbell","id":"859410401"},{"name":"Nick Schelle","id":"865860102"},{"name":"Jay Carvalho","id":"866115231"},{"name":"Atlantis Minnings","id":"869840183"},{"name":"Emily Moorhouse-Aires","id":"870585116"},{"name":"Julia Hudson","id":"872565653"},{"name":"Trevor Arduini","id":"874705346"},{"name":"Kimberlee Poitras","id":"876900474"},{"name":"Patrick Strachan","id":"877570564"},{"name":"Annie Wetselaar","id":"881665443"},{"name":"Dan Watters","id":"882625483"},{"name":"Robbie Schingler","id":"888105176"},{"name":"Jude Brown","id":"888870260"},{"name":"Gerry Morgan","id":"890600530"},{"name":"Andrea Segsworth","id":"891245021"},{"name":"Tara Campbell","id":"895865181"},{"name":"Art Goodwin","id":"900675596"},{"name":"Diana Walton","id":"900800607"},{"name":"Stephen Lang","id":"907560456"},{"name":"Rick Cooper","id":"1019214337"},{"name":"Gretchen Curtis","id":"1021180942"},{"name":"Sonya Smoley","id":"1021301173"},{"name":"Cam Young","id":"1033220870"},{"name":"Jonah Kagan","id":"1063350226"},{"name":"Plonkus Lucas","id":"1076725405"},{"name":"Aaron Greengrass","id":"1091166494"},{"name":"Gerald Mc Laverty","id":"1106362590"},{"name":"Rob d'Estrube","id":"1108498092"},{"name":"Cynthia Hovey","id":"1109661345"},{"name":"Jeri Bills","id":"1163058629"},{"name":"Faye Spilker","id":"1188828387"},{"name":"Marcus Redivo","id":"1194773513"},{"name":"Chris Haq","id":"1210143635"},{"name":"Mike Munson","id":"1223089140"},{"name":"John Phan","id":"1246896394"},{"name":"Denise Roybal-Lewis","id":"1266815376"},{"name":"Chris Bourne","id":"1305011287"},{"name":"Jonathan Liu","id":"1326155973"},{"name":"Benjamin Hall","id":"1352403381"},{"name":"Kevin Yun","id":"1370168301"},{"name":"Faye Coldwell","id":"1370513635"},{"name":"Teieste Yaska","id":"1437287988"},{"name":"Barb Finnerty","id":"1444633138"},{"name":"Darren Bradley","id":"1461766327"},{"name":"Trisha Hart","id":"1495036651"},{"name":"Ryan Fransen","id":"1548123744"},{"name":"Flockia Patricia","id":"1548363209"},{"name":"Anne Cheekie","id":"1552639122"},{"name":"Hugh Moore","id":"1565031572"},{"name":"Abraham Lucero","id":"1606504885"},{"name":"Lali Larrabure","id":"1662740769"},{"name":"'Stu Shaffer","id":"1755079315"},{"name":"Cheryl d'Estrube","id":"1791786395"},{"name":"Willi Weichselbaumer","id":"1813636765"},{"name":"Marilyn Redivo","id":"100000006594474"},{"name":"Ecsidus Junior","id":"100000010967471"},{"name":"Oh Munn","id":"100000102838312"},{"name":"Michael Penczarski","id":"100000129442286"},{"name":"Victor Martinez","id":"100000131926344"},{"name":"Brian Hall","id":"100000178030080"},{"name":"Dave Bradley","id":"100000238013563"},{"name":"Bryan Levine","id":"100000252876084"},{"name":"Wasana Sriniti","id":"100000319133516"},{"name":"Doppel Gänger","id":"100000350833711"},{"name":"Tim Kingdoms","id":"100000362687052"},{"name":"Justin Flock","id":"100000664518118"},{"name":"Tim d'Estrubé","id":"100000683521526"},{"name":"Billy Von","id":"100000701334818"},{"name":"Kanstantsin Andryieuski","id":"100000867923512"},{"name":"David Meagherqa","id":"100000873163506"},{"name":"Paul Mohme","id":"100000988632408"},{"name":"Paul Hawkins","id":"100001012790031"},{"name":"Orie LeBus","id":"100001032797739"},{"name":"Terence Kwan","id":"100001090577123"},{"name":"Danton Qa","id":"100001099782408"},{"name":"Kot DevTesting","id":"100001380110097"},{"name":"Scarlett Nevermore","id":"100001423518024"},{"name":"Abraham Zwork","id":"100001481402449"},{"name":"Michael Bailey","id":"100001503515511"},{"name":"Chris Mills","id":"100001567804743"},{"name":"Keviny Zqa","id":"100001610060302"},{"name":"Shawn Hardyho","id":"100001621523709"},{"name":"Colby Zqa","id":"100001628365162"},{"name":"Joe Crymes","id":"100001661333269"},{"name":"Matt Zy","id":"100001668287609"},{"name":"Sebastian Coldwell","id":"100001670642356"},{"name":"Paul Parratt","id":"100001674322291"},{"name":"Fescobar Tester","id":"100001732382528"},{"name":"Fescobar Hotmailtwo","id":"100001742668789"},{"name":"WestShore Customs","id":"100001761405168"},{"name":"Clayton D. Luffy","id":"100001857499974"},{"name":"Amelia Case","id":"100001906347155"},{"name":"Ccrymes Zgn","id":"100001909997561"},{"name":"JDev Allen","id":"100002036954310"},{"name":"Miles Testione","id":"100002067685505"},{"name":"Ryan Zy","id":"100002076837148"},{"name":"George Holland","id":"100002084804485"},{"name":"Robboitokraftschik Zqa","id":"100002191575859"},{"name":"Notyalc Krats","id":"100002195585484"},{"name":"Nehal Ekramoddoullah","id":"100002206538587"},{"name":"Simon Zee","id":"100002217292265"},{"name":"Chrizch van Rensburg","id":"100002221099858"},{"name":"Kelly Zngatest","id":"100002241739757"},{"name":"Jordan Zqa","id":"100002276164683"},{"name":"Lin Li","id":"100002283777808"},{"name":"Zed Nation","id":"100002456998532"},{"name":"Szqa Zqa","id":"100002461601742"},{"name":"Shonymc Zqa","id":"100002461939403"},{"name":"Phawkins Zqa","id":"100002462667133"},{"name":"Hell Bent","id":"100002506877693"},{"name":"Nilly Prangchan","id":"100002557890628"},{"name":"Glenn Zinja Wichman","id":"100002852403144"},{"name":"Lance Leslie","id":"100002878730809"},{"name":"Josh Zyn","id":"100003019575504"},{"name":"Puddaraju Zalt","id":"100003026416222"},{"name":"Zoshua Zurgin","id":"100003068389964"},{"name":"Mark Tester","id":"100003187244319"},{"name":"Leon Carl","id":"100003201739957"},{"name":"Josh Zyntwo","id":"100003280061699"}]

// End test/fakeFriends.json


// Begin =;
;

// End =;


// Begin =var fbid2zid=
var fbid2zid=

// End =var fbid2zid=


// Begin test/fakeZidMap.json
{"3925":40102248462,"24598":40101762513,"29380":40101194097,"105689":"40100172682","217871":40100065146,"314225":40100065206,"707888":40100064084,"1000969":"40100067755","1003672":"40100070202","1005320":"40100173228","1008358":"40100002392","1104848":40101195059,"1106449":40000063295,"1215007":"40000003217","2010395":40101058265,"2535641":"40100062705","3007441":"40100172851","3200156":"40100172680","4711515":40100065142,"5407980":"40100062706","6707094":"40100064085","8226419":"40100174215","12804039":"40100172891","15108661":40000060435,"20902433":"40102251946","28105373":40100065534,"58013514":40101809195,"58016200":40100065159,"71804306":40100065535,"116202916":"40100062061","116205141":"40100062707","122605732":"40100172903","122613502":"40100172905","127900102":40102248427,"172002213":40100065160,"174800006":"40100063156","187901952":40100065207,"219500090":40100064093,"500010087":40101201454,"500010509":"40100064094","500012624":"40100002106","500012744":"40100064095","500013127":"40100062708","500013626":"40100062709","500020275":40101194031,"500036144":"40100062710","500045956":"40100064096","500066908":40100065161,"501265890":40100065162,"501546012":"40100062711","501571534":40100065163,"501682370":"40100062712","502301153":40100065165,"502411873":40100061555,"502425131":40100065208,"502592590":40100065166,"503089224":"40100062713","503612290":"40100062714","504491041":"40100064099","505024602":40100065209,"506628630":"40100062715","506667136":"40100173258","506749194":"40100062716","506766617":40100065164,"507031377":40101584650,"507691193":"40100062718","508499222":40100062802,"508839112":40100065210,"508955859":40100065536,"510626438":40100065211,"511217568":"40100064261","511557695":40100065212,"511573683":"40100064112","511664568":"40100062719","511784873":"40100064113","511805713":"40100062720","513441928":40100065537,"513730915":40100065167,"513871303":40100065168,"515197243":40100065214,"515576668":"40100062721","515940424":"40100062722","516078268":"40100062704","516098147":"40100062723","516198140":"40100062724","516555263":40100065169,"516614511":"40100062726","516626841":40100062727,"516854896":40100062729,"516868958":40100065215,"517417846":40100065170,"517829231":"40100062730","517965649":"40100062731","518376489":40100065216,"518615192":40100064878,"520743198":40100065217,"520916061":40100064124,"521096827":40100062732,"521721490":"40100062733","522301885":40100065143,"523757465":40100065219,"523941575":40100062840,"524466075":40100065220,"524752783":40100065538,"526099736":40000065764,"526191531":40100064126,"526931835":40100065221,"527822395":40100065222,"530620621":40100065223,"530830166":40100065224,"531221144":40100064879,"531537186":40100065539,"531665162":40100065147,"531976507":40100064880,"532506336":40100065225,"532561875":40100064128,"532867245":40100062734,"532884803":40100062849,"537710244":40100065226,"537820121":"40100064131","538398814":"40100172669","538606525":"40100002352","539160587":40100064132,"539271502":40100065227,"539914051":40100062735,"540106978":40100062780,"540585528":40100062736,"540821404":40100065228,"542614713":40100062854,"544566750":40100065229,"544745489":40100062737,"546900345":40100065230,"547935972":40100065540,"548784901":40100065171,"550435713":40100065172,"553695433":40100065173,"553825179":40100065231,"554043409":40100065232,"554376189":40102249305,"554977050":40100065541,"555279551":40101809194,"555380156":40100065542,"558497222":40100065233,"560197058":"40000005515","560400540":40100065174,"560536804":40100062866,"560795383":40100065148,"561121150":40100065543,"562076422":40100065544,"563265844":40100065545,"563285850":40100065175,"563830645":40100065149,"565785286":40100062738,"568050201":40100065234,"569206415":40100062874,"570550867":"40100062739","573384454":40100065176,"573960161":40100062876,"577750221":40100065177,"578026207":40100065235,"579426256":40100065236,"579610713":"40100067158","580696643":40100065237,"583321237":40100065238,"584454492":40100065239,"587150787":"40000004491","588485165":40100065240,"591245812":40100065178,"591735190":40100065546,"592601511":40101201970,"593422395":40100065241,"596116567":40100064220,"596904781":40100065179,"598317040":40100065242,"598480147":40100065150,"600330910":40100065243,"600626097":"40100067149","601486977":"40100062740","601998078":"40100174228","602470308":"40101200359","602626600":40101809196,"603691852":40100065180,"603850785":40100064881,"604294114":40100065244,"604721726":"40100062913","605045477":"40100062741","610716469":40100065245,"611258318":40100065246,"611336186":40100067154,"611807562":40100062922,"613151228":"40100062923","613434749":40100065181,"615080580":"40100062743","618425684":"40100062930","619170270":40100065547,"620501201":"40100064149","621061419":40100065182,"621232328":40100062932,"621673036":40100065247,"622177208":"40100062744","622235708":40100065548,"622400764":40100065248,"622797711":40100065183,"625247281":40100065249,"626142196":40100065250,"626870931":40100064882,"627220365":40100065251,"628300499":40100065252,"629950268":40100065253,"631655258":40100064883,"631725380":40100065254,"631847616":40100065255,"633164517":"40100062942","633280411":40100065256,"634249564":40100065257,"636355617":"40100062745","638940642":40000068394,"641047827":40100065258,"641317793":40100065259,"642047649":40100065151,"642411807":40100065260,"643455175":"40100062746","646751681":40100065261,"647170693":40100065184,"647945152":40100065262,"649386267":"40100064158","650526629":40100065185,"650772142":40100065263,"651010103":"40100062748","651746509":40100065152,"652248838":"40100173031","652665498":40100065186,"654291354":40100065187,"655935000":"40100062749","656382795":"40100062968","656552323":40100065153,"658813572":"40102252001","659575873":40100065265,"660870265":40100065266,"661406256":40100065267,"661407039":40100065549,"661562454":40100065154,"662215862":40000053568,"663147602":40100065268,"666465936":"40100062973","666540597":40100065188,"673320789":40100065269,"675080248":40100065270,"677060706":40100065271,"677700170":40100065272,"681685080":40100062997,"684095070":"40100062750","685695550":"40100064166","685820411":"40100063000","686322026":40100065273,"686340315":40100065550,"686662270":40100065190,"687669549":40100065191,"689091709":40100062751,"689681758":"40000004962","690164572":"40100111949","690285515":"40100062752","690586860":40100065274,"690671785":"40100062753","690841560":40100062754,"691207203":40100065275,"692266931":"40100062755","692371395":40100064884,"693283369":40100783371,"693960506":40100064168,"694131816":40100062756,"695190985":40100065551,"696696572":40100064885,"696745940":40100065276,"697841244":40100064393,"697861996":40100065277,"698107347":40100063006,"698456005":40100065278,"699571228":40101194262,"700400831":40100065193,"702512921":40100062757,"702795693":"40100173479","704583622":"40100172801","706836839":"40100064221","708395886":40100064877,"708815391":40100065192,"716036832":40100065279,"716290205":"40100068284","716361400":"40100173074","716390510":40100065553,"718105900":40100172663,"719051301":"40100055205","719755075":40100064175,"720951533":"40101200372","721505271":40100065145,"722730489":40100065281,"722751398":40100065282,"725000189":40100062758,"725763218":"40100062759","729157512":40100063033,"730140157":40100065283,"731557039":40100065284,"732486281":40100064886,"734166232":40100064178,"735562176":40100064887,"735900528":"40100062760","736038664":"40100064179","736630385":40100065554,"737755410":40100062761,"737881927":40100065555,"740940061":"40100062762","741534292":"40100173527","744681755":"40100062763","747984712":40100065285,"748220618":"40100062764","748248427":40100063046,"748475421":40100065286,"748526006":40100063047,"749825353":40100063048,"752145170":40100063051,"765955141":40100065194,"767462649":40100062765,"768760054":40100065195,"769250701":"40000005081","784913384":40100065287,"788283707":40100063068,"788751324":40100065155,"789179368":"40100063069","789875718":40100065288,"790155297":40100062766,"790734358":40100062767,"791706634":"40100063070","793904130":40101541450,"812015150":40100065291,"814230018":"40100062768","817660206":40100065292,"820380376":40100064189,"824510520":40100065293,"827563537":40100064888,"831995471":"40100062769","833870500":40100065294,"838835159":40100065156,"840680009":40100065196,"844490297":40100063089,"845900018":40100065197,"846785250":40100065198,"848670312":40100064196,"849540456":40100064197,"855670081":40100065199,"859350552":40100065295,"859410401":40100065296,"865860102":40100064222,"866115231":40100065556,"869840183":40100065297,"870585116":40100065298,"872565653":40100063100,"874705346":40100065200,"876900474":40100065201,"877570564":"40100062770","881665443":40100065299,"882625483":40100065202,"888105176":40100065300,"888870260":40100065301,"890600530":40100065302,"891245021":40100065203,"895865181":"40100062771","900675596":40100065303,"900800607":40100065304,"907560456":"40100062772","1019214337":40100065305,"1021180942":40100065306,"1021301173":40100064199,"1033220870":40100062773,"1063350226":40101536450,"1076725405":"40100173772","1091166494":"40100062774","1106362590":40100065308,"1108498092":40100065309,"1109661345":40100065310,"1163058629":40100065311,"1188828387":40100065312,"1194773513":"40100062775","1210143635":"40100063119","1223089140":"40000011265","1246896394":"40100064202","1266815376":"40100064204","1305011287":"40100172671","1326155973":40000053714,"1352403381":"40100173647","1370168301":"40100064083","1370513635":40100063125,"1437287988":"40000003497","1444633138":40100065313,"1461766327":40100065314,"1495036651":40100065204,"1548123744":40100062776,"1548363209":"40100064206","1552639122":40100065557,"1565031572":"40000008361","1606504885":"40100174245","1662740769":40103095159,"1755079315":"40000002190","1791786395":40100177457,"1813636765":40100063127,"100000006594474":"40100062777","100000010967471":"40000006472","100000102838312":"40000011274","100000129442286":40100065558,"100000131926344":"40000006475","100000178030080":40100062778,"100000238013563":40100065315,"100000252876084":"40100054578","100000319133516":40100172664,"100000350833711":40100064026,"100000362687052":40100064033,"100000664518118":40100063141,"100000683521526":40100065157,"100000701334818":40100063142,"100000867923512":"40100173735","100000873163506":"40100174207","100000988632408":40100001405,"100001012790031":40101539450,"100001032797739":40100065205,"100001090577123":"40100174208","100001099782408":"40100172672","100001380110097":40101586150,"100001423518024":"40100177443","100001481402449":"40100172670","100001503515511":"40100172677","100001567804743":40100065158,"100001610060302":"40100172676","100001621523709":"40100063153","100001628365162":"40100002346","100001661333269":40100067331,"100001668287609":"40100173222","100001670642356":40100063154,"100001674322291":"40100062779","100001732382528":"40100172674","100001742668789":40100067338,"100001761405168":40103047170,"100001857499974":40100067333,"100001906347155":40100054560,"100001909997561":40100001464,"100002036954310":"40100066814","100002067685505":40101585550,"100002076837148":"40100071393","100002084804485":"40100071348","100002191575859":40100113778,"100002195585484":"40100109695","100002206538587":40100172665,"100002217292265":"40101196796","100002221099858":"40100124731","100002241739757":"40100177181","100002276164683":40100115266,"100002283777808":40101226937,"100002456998532":40101536550,"100002461601742":40101585050,"100002461939403":40100785890,"100002462667133":40101194354,"100002506877693":"40101199845","100002557890628":40101199621,"100002852403144":"40101762352","100002878730809":"40101806220","100003019575504":"40102252890","100003026416222":40103095261,"100003068389964":40102232825,"100003187244319":40103069372,"100003201739957":"40102250002","100003280061699":40103047171}

// End test/fakeZidMap.json


// Begin =;
;

// End =;


// Begin test/fakeDataInjector.js
/*global clock, fbFriends, fbid2zid, InboxService*/
(function (clock, fbFriends, fbid2zid, InboxService) {
	var
		root = this,
		FakeDataInjector = { VERSION: '0.0.4' },
		previous = root.FakeDataInjector
	;
	root.FakeDataInjector = FakeDataInjector;

	var //test/fakeDataInjector.js:10//
		aggs = [undefined, 'coins', 'energy1', 'energy3', 'beans', 'chips'],
		concurrency = [3, 5, 7, 11, 13],
		games = [1, 67, 73, 81, 88, 101, 223],
		session = clock.session(),
		snids = [1, 18, 21],
		types = ['invite', 'gift', 'help', 'crew', 'notif', 'recommendation'],
		fbid2name = {},
		zids = [],
		zid2fbid = {},
		INBOX_MAX_APPROX = 200 //test/fakeDataInjector.js:20//
	;

	(function () {
		var fbid, friend, i = -1, len = fbFriends.length, zid;
		while (++i < len) {
			friend = fbFriends[i];
			fbid2name[friend.id] = friend.name;
		}
		for (fbid in fbid2zid) {
			if (fbid2zid.hasOwnProperty(fbid) && fbid2name.hasOwnProperty(fbid)) { //test/fakeDataInjector.js:30//
				zid = parseInt(fbid2zid[fbid], 10);
				zids.push(zid);
				zid2fbid[zid + ''] = fbid;
			}
		}
	}());

	function pickOne(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	} //test/fakeDataInjector.js:40//

	function makeFriend(zid) {
		var fbid = zid2fbid[zid];
		return {
			zid: zid,
			snuid: fbid,
			snid: 1,
			name: fbid2name[fbid],
			pic: 'https://graph.facebook.com/' + fbid + '/picture?type=square'
		}; //test/fakeDataInjector.js:50//
	}

	// Sort messages by aggregation size
	FakeDataInjector.compareMessages = function (tuple) {
		return tuple[1].ids.length - tuple[0].ids.length;
	};

	FakeDataInjector.generateRawMessage = function () {
		var
			now = (new Date()).getTime(), //test/fakeDataInjector.js:60//
			agg = pickOne(aggs),
			message = {
				id: 'm' + now + ':' + (Math.random() * 100),
				snid: pickOne(snids),
				game: pickOne(games),
				sender: makeFriend(pickOne(zids)),
				ts: now,
				type: pickOne(types),
				request_ids: {},
				data: { //test/fakeDataInjector.js:70//
				}
			}
		;
		if (agg) {
			message.agg = agg;
		}
		return message;
	};

	FakeDataInjector.generateAFewRawMessages = function () { //test/fakeDataInjector.js:80//
		var
			i = -1,
			num = pickOne(concurrency),
			messages = []
		;
		while (++i < num) {
			messages.push(FakeDataInjector.generateRawMessage());
		}
		return messages;
	}; //test/fakeDataInjector.js:90//

	FakeDataInjector.groupMessage = function (message) {
		switch (message.type) {
		case 'gift':
			return 'Gifts';
		case 'invite':
			return 'Neighbor Invites';
		case 'help':
		case 'crew':
			return 'Help Requests'; //test/fakeDataInjector.js:100//
		case 'notif':
			return 'Messages';
		case 'recommendation':
			return 'Recommended Neighbors';
		}
	};

	FakeDataInjector.inject = function () {
		var
			messages = FakeDataInjector.generateAFewRawMessages(), //test/fakeDataInjector.js:110//
			len = messages.length,
			pl = len > 1
		;
		console.log('Injecting ' + len + ' fake message' + (pl ? 's' : ''));
		InboxService.addRawMessages(messages);
	};

	FakeDataInjector.start = function () {
		session.unpause();
		session.setTimeout(function () { //test/fakeDataInjector.js:120//
			var count = InboxService.get('count');
			if (count < INBOX_MAX_APPROX) {
				FakeDataInjector.inject();
				FakeDataInjector.start();
			} else {
				console.log('There are ' + count + ' messages in the Inbox.');
			}
		}, Math.floor(Math.random() * 5000));
	};
 //test/fakeDataInjector.js:130//
	FakeDataInjector.pause = session.pause;
	FakeDataInjector.unpause = session.unpause;

}(clock, fbFriends, fbid2zid, InboxService));

// End test/fakeDataInjector.js


// Begin =clock.noConflict();
clock.noConflict();

// End =clock.noConflict();


// Begin test/checkForDAPI.js
/*global DAPI, DAPIBootstrap, FakeDataInjector, InboxService, jQuery*/
(function (FakeDataInjector, InboxService, $) {

	var
		// Apps to authenticate against
		apps = {
			ccampbell_snapiville: { appid: 191919, fbappid: 171377519571283 },
			CityVille: { appid: 75, fbappid: 291549705119 },
			ZLive: { appid: 1005, fbappid: 176611639027113 }
		}, //test/checkForDAPI.js:10//
		selectedApp = 'CityVille'
	;

	function log(msg) {
		if (typeof console !== 'undefined' && console && console.log) {
			if (typeof msg === 'string') {
				console.log('checkForDAPI: ' + msg);
			} else {
				console.log('checkForDAPI:');
				console.log(msg); //test/checkForDAPI.js:20//
			}
		}
	}

	$(function () {
		if (typeof DAPI !== 'undefined') {
			log('found DAPI');
			InboxService.setDAPI(DAPI);
		} else if (typeof DAPIBootstrap !== 'undefined') {
			log('found DAPIBootstrap'); //test/checkForDAPI.js:30//
			if (document.domain.indexOf('zynga.com') > -1) {
				log('on zynga.com domain; doing auth through ' + selectedApp);
				$(document.body).append('<div id="fb-root"></div>');
				DAPIBootstrap.load(
					{
						appid: apps[selectedApp].appid,
						fbappid: apps[selectedApp].fbappid,
						local_xd_receiver: '',
						callback_url: 'http://ccampbell-snapiville-fb.dev-pod-05.zlive.zynga.com/',
						//rest_url: 'http://ccampbell-dapi.dev-pod-05.zlive.zynga.com/server/public/', //test/checkForDAPI.js:40//
						rest_url: 'https://api.zynga.com/',
						dapi_url: 'http://ccampbell-dapi.dev-pod-05.zlive.zynga.com/client/js/src'
					},
					function () {
						InboxService.setDAPI(DAPI);
					}
				);
			} else {
				log('not on a zynga.com domain; injecting fake data');
				FakeDataInjector.start(); //test/checkForDAPI.js:50//
			}
		} else {
			log('found neither DAPI nor DAPIBootstrap; begin injecting fake data');
			FakeDataInjector.start();
		}
	});
}(FakeDataInjector, InboxService, jQuery));

// End test/checkForDAPI.js

