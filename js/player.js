//Namespace for the video api
(function ( videoapi , $, undefined) {
	//Do the following operation when document is loaded
	$(document).ready(function(){
		
		//Checks for browser's support for local storage
		var supports_html5_storage = function() {
		  try {
		    return 'localStorage' in window && window.localStorage !== null;
		  } catch (e) {
		    return false;
		  }
		}

		//Call the function supports_local_storage
		supports_html5_storage();


		//Call back function to render videoplayer and controls
		var callback = function(text)
		{
			//Parse the clips.json file and store the it in variable data
			var data = JSON.parse(text);

			
			//Build the local storage value
			var WatchedList = buildLocalStorageFromData(data);
			var localStorageVideoList = localStorage.getItem("VideoListStrge");

			//Check if any local storage data present for this page
			//If null then set it to WatchedList
			localStorageVideoList = localStorageVideoList || WatchedList;
			
			//Reder the video player using the parsed data
			renderRecievedData(localStorageVideoList,data);
		};


		var buildLocalStorageFromData = function(videodata){
			var returnVal;
			$.each(videodata, function(i,video){
				if(i ==0 ){
					returnVal = video['id'];
				}
				else{
					returnVal = returnVal.concat("##").concat(video['id']);
				}
			});
			return returnVal;
		};

		//Function which renders the video player
		var renderRecievedData = function(localStorageVideoList,videodata){

        
        //split the local storage based on the delimiter ##
        localStorage.setItem("VideoListStrge",localStorageVideoList);
        var videoList = localStorage.getItem("VideoListStrge");
        console.log(videoList);
        var videoId = videoList.split("##");

        //Flag helps us to first element to main video tag
        var firstFlag = "first";
        
        //Iterate over the array of video Id
        $.each(videoId, function(i,id){
        	//Iterate over the video data 
        	$.each(videodata, function(index,video){
        		//Check if the id is equal to video id in videodata array
        		if(id == video['id']) {

        			var videoURL =  video['content-url'];
			        var videoThumbURL = video['thumb-url'];
			        var desc = video["description"];
			        var vidId = video["id"];
			        var headline = video['name'];

        		  	if(firstFlag == "first"){
        		  		
        		  	   //Set the video attributes for the main video tag
			      	   $(".hook").find('#video').attr("poster", videoThumbURL);
			       	   $(".hook").find('#video').attr("src", videoURL);
			           $(".hook").find('#video').data("id", vidId);
			           $(".hook").find('#video').data("headline", headline);
			           $(".hook").find('#video').data("desc", desc);
			        	
			           //Set the Video Title
			           $(".hook").find('#title').text(headline);
			           //Set the video description
			           $(".hook").find('#description').text(desc);

        		  	   //set the flag to diffrent to distinguish from the first element
        		  	   firstFlag = "different";
        		  	}
        		  	else{
        		  		
        		  		//Construct the video elements using the data from the array
	          	 		var vidElemt = $("<video width='200' height='250' class='btmvideo'></video>").attr({
	                              poster: videoThumbURL,
	                              src: videoURL
	                             });

	          	 		//Append the id,headlline and desc so it will be reused
	          	 		vidElemt.data("id", vidId);
	          	 		vidElemt.data("headline",headline);
	          	 		vidElemt.data("desc",desc);

	          			//append the elements in the bottom of the class player
	          			$('.hook').find('.player').append(vidElemt);
        		  	}
        		  }          	
       		 })
    	})

        
        //When the user clicks on the bottom videos then play it accordingly
        $('.hook').on('click','.btmvideo',function(){

        	//Get the Clicked Video URL information
        	var videoURL =  $(this).attr("src");
        	//Get the Clicked Thumbnail information
         	var videoThumbURL = $(this).attr("poster");
         	//Get the description of video
         	var desc = $(this).data("desc");
         	//Get the id information
       	  	var id = $(this).data("id");
       	  	//Get the headline information
         	var headline = $(this).data("headline");

         	//Set the retrived attributes to the main video tag
      		$(".hook").find('#video').attr("poster", videoThumbURL);
       		$(".hook").find('#video').attr("src", videoURL);
        	$(".hook").find('#video').data("id", id);
        	$(".hook").find('#video').data("headline", headline);
        	$(".hook").find('#video').data("desc", desc);

        	$(".hook").find('#video')[0].load();

        	//Set the corresponding Video Headline
        	$(".hook").find('#title').text(headline);
        	//Set the video description
        	$(".hook").find('#description').text(desc);
        	//If the user clicks when the video is getting played then set the btn value to play
        	$('#btn').val('Play');
        	//Set the progress bar width to 0px
        	$('#progress-bar').width(0);
        	//Hide the description initially
        	$("#description").hide();

        	//Play the video
		    $('#video')[0].play();

		    //Now reset the value of the button to Pause
        	$('#btn').val('Pause');

        	//call the function to Change the localStorage
        	ChangeLocalStorageWatchedList(id);


        });


		//When the user click on the  thumb nail of main video tag then start playing the video
		$('#video').on('click',function(){

			//Get the id from the video
			var id = $('#video').data('id');

			//load the video
			$('#video')[0].load();

			//Play the video
		    $('#video')[0].play();

		    //Now reset the value of the button to Pause
        	$('#btn').val('Pause');

        	//call the function to Change the localStorage
        	ChangeLocalStorageWatchedList(id);

		});

		//Function which changes the local storage value
		var ChangeLocalStorageWatchedList = function(videoId){

			//Get the current local storage value
			var localStrgeVideoList = localStorage.getItem("VideoListStrge");

			//Spllit the value in to the array based on delimiter ##
			var videoListArray = localStrgeVideoList.split("##");

			// Find and remove passed videoId from an array
			var i = videoListArray.indexOf(videoId);
			if(i != -1) {
				videoListArray.splice(i, 1);
			}

			//Contains the formatted the videoId Liat
			var changedIdList = "";
			
			//Iterate over the array and build the new local storage value
			$.each(videoListArray, function(i, vidId){
				changedIdList = changedIdList.concat(vidId).concat("##");
			});

			//Append the passed video Id to the end
			changedIdList = changedIdList.concat(videoId);

			//Set the local storage
			localStorage.setItem("VideoListStrge",changedIdList);
			
		}


		//Button handler function which plays and Pauses the videos depending on the button click
		$('#btn').on('click', function(){
			//Get the button and video id
			btn = document.getElementById('btn');
			video = document.getElementById('video');

			var vidId = $('video').data('id');
			
			//call the function to Change the localStorage
			ChangeLocalStorageWatchedList(vidId);

			//Toggling between video pause and play
			if(video.paused)
			{
				//If Paused, Play It
				video.play();
				btn.value = "Pause";

			} else{
				//If Playing, Pause it
				video.pause();
				btn.value = "Play";
			}

		});

		//Time Update Function to control the status of the scrolling bar
		$('#video').on('timeupdate',function(){
			//Get the progress bar div tag
			progressBar = document.getElementById('progress-bar');
			video = document.getElementById('video');
			//Get the video running time
			current = video.currentTime;
			//Get the video duration
			duration = video.duration;
			//Calculate the current progress
			currentProgress = (current/duration)*1000;
			//Update the progress bar status
			progressBar.style.width = currentProgress + "px";

			//If percentage of video played is greater than 25 then load the description
			if((current/duration)*100 >= 25){
				$("#description").show();
				$("#description").addClass('animateDescription');
				//$('#description').animate({'left':'1000px'},'slow');
			}
			//If the video is ended then stop the animation and load the next video 
			if((current/duration)*100 === 100)
			{
				$("#description").removeClass('animateDescription');
			}
		});


		//Check whether the current video has finished playing if so then reset the progress bar and 
		//reset the play button
		$('#video').on('ended', function(){

			//Reset btn value to play
			$('#btn').val('Play');
			
			//ReSet the progress bar width to 0px
			$('#progress-bar').width(0);
			        
			//Hide the description initially
			$("#description").hide();

		});


		//To seek the video to the position where mouse is clicked on scrollbar
		$('#progress').on('mousedown', function(event){
			event.stopPropagation();
			//Get the progress bar
			progressContainer = document.getElementById('progress');
			video = document.getElementById('video');

			//Calculting the postion of progress bar
			position = event.pageX - progressContainer.offsetLeft;
			//Get the duration
			duration = video.duration;

			//Calculating the current position of the video
			seekPosition = (position/1000)* duration;
			//Make the current video time to the seek position
			video.currentTime = seekPosition;
		});



		// Event Listener for the theatre mode
		$('#theatremode').on('click', function(){
			
			//Make the botton list videos to disappear
			$('.btmvideo').each(function(){
				$(this).toggleClass('invisible');
			});

			//Increase the video size
			$('#video').width('1100');
			$('#video').height('800');
			$('#progress').width('1100');

			//Also display the description down
			$('#title').css('margin-top','-400px');
			$('#description').css('margin-top','-60px');

			//Hide the theatre mode button
			$('#theatremode').hide();

			//Check whether the current video has finished playing then display the next video
			$('#video').on('ended', function(){

	         	//For each listed video on the bottom
	         	$('.btmvideo').each(function(i){

	         		//Check the video has ended
	         		if($('#video')[0].ended){

		         		//Get the Clicked Video URL information
			        	var videoURL =  $(this).attr("src");
			        	//Get the Clicked Thumbnail information
			         	var videoThumbURL = $(this).attr("poster");
			         	//Get the description of video
			         	var desc = $(this).data("desc");
			         	//Get the id information
			       	  	var id = $(this).data("id");
			       	  	//Get the headline information
			         	var headline = $(this).data("headline");


			         	//Set the retrived attributes to the main video tag
			      		$('#video').attr("poster", videoThumbURL);
			       		$('#video').attr("src", videoURL);
			        	$('#video').data("id", id);
			        	$('#video').data("headline", headline);
			        	$('#video').data("desc", desc);

			        	//Load the video
			        	$('#video')[0].load();


			        	//Set the corresponding Video Headline
			        	$(".hook").find('#title').text(headline);
			        	//Set the video description
			        	$(".hook").find('#description').text(desc);
			        	//If the user clicks when the video is getting played then set the btn value to play
			        	$('#btn').val('Play');
			        	//Set the progress bar width to 0px
			        	$('#progress-bar').width(0);
			        	//Hide the description initially
			        	$("#description").hide();

			        	//Play the video
			        	$('#video')[0].play();

			        	//Make the button text pause
			        	$('#btn').val('Pause');
			        	
		        	}

	         	});
			});

		});



	}
		//Dynamically parse the clips.json file
		ajax.get("clips.json", callback);
	});

})(window.videoapi = window.videoapi || {} , jQuery)