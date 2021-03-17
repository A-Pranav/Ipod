// at some intances ther will be some comments made 
// to check if the prior code is working correctly


$(document).ready(function () {
	var v, up = 0, down = 0, i = 0, menu = 0, incr = function () {
		i++;
		//starting
		if ($("#audioplayer").is(":visible") == true) {
			if ($(".timeline").is(":visible") == true) {
				// $(".timeline").hide();
				$(".volume").show();
				return;
			}
			//ending of inner if
			else if ($(".scrolltime").is(":visible") == true) {
				audioPlayer.currentTime += 5;
				return;
			}
			else {
				var volume = audioPlayer.volume;
				volume = volume + 0.1;
				if (volume > 1)
					volume = 1;
				audioPlayer.volume = volume;
				volume = audioPlayer.volume * 100;
				$(".volumelevel").css("width", volume + "%");
				return;
			}
		}
		//ending
		//code for the list scroll
		var current = $(".select");
		if ($(current).is(':last-child') == false) {
			//alert("last");
			$(current).removeClass('select');
			var next = $(current).next();
			$(next).addClass('select');
		}

		menu++;//count for current menu item
		if ($(".on ul a").length < menu + 1) {
			menu = $(".on ul a").length - 1;
		}
		if (menu > 5) {
			var rem = menu - 5;
			//alert(rem);
			$(".on ul a:nth-child(" + rem + ")").hide();

		}
		//ending of current if
		//ending of scroll

	}
		//ending of increment
		, decr = function () {
			i--;
			//start sound
			if ($("#audioplayer").is(":visible") == true) {
				if ($(".timeline").is(":visible") == true) {
					$(".timeline").hide();
					$(".volume").show();
					return;
				}
				//ending of inner if
				else if ($(".scrolltime").is(":visible") == true) {
					audioPlayer.currentTime -= 5;
					return;
				}
				else {
					var volume = audioPlayer.volume;
					volume = volume - 0.1;
					if (volume < 0)
						volume = 0;
					audioPlayer.volume = volume;
					volume = audioPlayer.volume * 100;
					$(".volumelevel").css("width", volume + "%");
					return;
				}
			}
			//ending
			//starting of code related to scroll
			menu--; //count for current menu item
			//alert(menu);
			if (menu < 0) {
				menu = 0;
			}
			$(".on ul a:nth-child(" + menu + ")").show();
			//this shows the menu which comes before this one, if it is hidden
			//alert("unhide");
			var current = $(".select");
			if ($(current).is(':first-child') == false) {
				//alert("last");
				$(current).removeClass('select');
				var prev = $(current).prev();
				$(prev).addClass('select');
			}
			if (menu > 5) {
				var rem = menu - 5;
				//alert(rem);
				$(".on ul a:nth-child(" + rem + ")").hide();
			}
			//ending of if
			//ending of scroll
		};
	$(".dial").knob({
		min: 0, max: 20, stopper: false, change: function () {
			if (v > this.cv) {
				if (up) {
					decr();
					up = 0;
				}
				else { up = 1; down = 0; }
			}
			else {
				if (v < this.cv) {
					if (down) {
						incr();
						down = 0;
					}
					else {
						down = 1; up = 0;
					}
				}
			}
			v = this.cv;
		}
		, 'release': function (v) {
			//alert(v);
		}
	});
	//hiding all and showing only the home menu
	$("#homemenu").addClass("on");
	press();
	function press() {
		$(".tile").hide();
		$(".on").show();
		//select the first child of the menu
		$(".select").removeClass();
		$(".on ul a:first-child").addClass("select");
	}
	//end press
	var path = [];
	//used to store history
	//click the id button
	$("#select").click(function (e) {
		e.preventDefault();
		menu = 0;
		//reset menu;
		//if about screen is on, don't do anything
		if ($("#about").is(":visible") == true) {
			return;
		}
		//this if is used to allow ffw and rwd using scroll button 
		if ($("#audioplayer").is(":visible") == true) {
			if ($(".timeline").is(":visible") == true) {
				//alert("asdas");
				$(".timeline").hide();
				$(".scrolltime").show();
				return;
			}//inner if
			else if ($(".scrolltime").is(":visible") == true) {
				$(".scrolltime").hide();
				$(".timeline").show();
				return;
			}//else if start
			else if ($(".volume").is(":visible") == true) {
				$(".volume").hide();
				$(".timeline").show();
				return;
			}//else if end
		}//outer if end
		number = 0;
		if ($(".play").is(":visible") == true) {
			songurl = [];
			songtitle = [];
			songartist = [];
			songalbum = [];
			songtrackno = [];
			var i = 0;
			$('.on a').each(function () {
				var song = $(this);
				var url = song.attr("data-url");
				var title = song.attr("data-title");
				var artist = song.attr("data-artist");
				var album = song.attr("data-album");
				var trackno = song.attr("data-trackno");
				songurl.push(url);
				songtitle.push(title);
				songartist.push(artist);
				songalbum.push(album);
				songtrackno.push(trackno);
				if ($(this).hasClass("select")) {
					number = i;
				}
				i++;
			});
			//alert(songtitle);
		}
		//ending of if
		var newon = $(".on");
		var back = $(newon).attr('id');
		path.push(back);
		newon.removeClass("on");
		newon = $(".select").attr('href');
		$(newon).addClass("on");
		if (newon == "#audioplayer") {
			if (typeof audioPlayer === "undefined") {
				audioPlayer = new Audio();
				loadplayer();
			}
			//end the inner if undefined
			else {
				loadplayer();
			}
		}
		//ending of if
		press();
	});
	//ending of select click code
	//load player
	function loadplayer() {
		audioPlayer.controls = "controls";
		if (audioPlayer.canPlayType('audio/mpeg')) {
			audioPlayer.src = songurl[number] + ".mp3";
		}
		else {
			audioPlayer.src = songurl[number] + ".ogg";
		}
		audioPlayer.oncanplaythrough = "isAppLoaded";
		audioPlayer.autoplay = "autoplay";
		audioPlayer.addEventListener('ended', nextSong, false);
		document.getElementById("player").appendChild(audioPlayer);
		//code for controls the time and timebar
		$("#player audio").bind('timeupdate', function () {
			var rem = parseInt(audioPlayer.duration - audioPlayer.currentTime, 10),
				pos = (audioPlayer.currentTime / audioPlayer.duration) * 100,
				mins = Math.floor(rem / 60, 10),
				secs = rem - mins * 60;
			$(".time").text("-" + mins + ':' + (secs > 9 ? secs : '0' + secs));
			$(".trackbartime").css("width", pos + "%");
			$(".scrolltimelevel").css("width", `${pos}%`);
		});
		//displaying the play pause notification
		$("#pauseindicator").hide();
		$("#playindicator").show();
		var volume = audioPlayer.volume * 100;
		$(".volumelevel").css("width", volume + "%");
		//fill the data in audioplayer div
		$(".tracknumber").text(songtrackno[number]);
		$(".songtitle").text(songtitle[number]);
		$(".songartist").text(songartist[number]);
		$(".albumtitle").text(songalbum[number]);
		audioPlayer.play();
	}
	//ending of load player code
	//this function plays the net song in the song list when a song ends
	function nextSong() {
		number++;
		if (number == songurl.length) {
			number = 0;
		}
		loadplayer();
	}
	//ending of nextSong code 
	//this button play/pauses the song and changes the indicator.
	$("#playpausebutton").click(function (e) {
		e.preventDefault();
		if (audioPlayer.paused) {
			audioPlayer.play();
			$("#pauseindicator").hide();
			$("#playindicator").show();
		}
		else {
			audioPlayer.pause();
			$("#pauseindicator").show();
			$("#playindicator").hide();
		}
	});
	//end click playpause
	//clicking the back button
	$("#back").click(function (e) {
		e.preventDefault();
		menu = 0;//reset menu;
		//go back to song when sound is shown
		if ($("#audioplayer").is(":visible") == true) {
			if ($(".volume").is(":visible") == true) {
				$(".volume").hide();
				$(".timeline").show();
				return;
				//end sound
			}//inner if end
			else if ($(".scrolltime").is(":visible") == true) {
				$(".scrolltime").hide();
				$(".timeline").show();
				return;
			}//else if
		}//outer if
		//alert("lol");
		if (path.length != 0) {
			var back = path.pop();
			//alert(back);
			var newon = $(".on");
			newon.removeClass("on");
			$("#" + back).addClass("on");
			press();
		}//end if	
	});//end back button
	//click the fast forward button
	var count = 0; // this variable helps seperate single click and long presses
	timeout = 0;
	$("#fastforwardbutton").click(function (e) {
		e.preventDefault();
		if (count < 1) {
			number++;
			if (number == songurl.length) { number--; }
			loadplayer();
		}
		count = 0;
	});
	$("#fastforwardbutton").mousedown(function () {
		timeout = setInterval(function () {
			if ($("#audioplayer").is(":visible") == true) {
				audioPlayer.currentTime += 10;
				count++;
			}//end if
		}, 500);
		return false;
	});
	//this function clears the timeout variable
	$("#fastforwardbutton").mouseup(function () {
		clearInterval(timeout);
		return false;
	});
	//end ffw
	//click the rewind button
	$("#rewindbutton").click(function (e) {
		e.preventDefault();
		if (count < 1) {
			number--;
			if (number < 0) { number++; }
			loadplayer();
		}
		count = 0;
	});
	$("#rewindbutton").mousedown(function () {
		timeout = setInterval(function () {
			if ($("#audioplayer").is(":visible") == true) {
				audioPlayer.currentTime -= 10;
				count++;
			}//end if
		}, 500);
		return false;
	});
	$("#rewindbutton").mouseup(function () {
		clearInterval(timeout);
		return false;
	});
	//end rewind
});