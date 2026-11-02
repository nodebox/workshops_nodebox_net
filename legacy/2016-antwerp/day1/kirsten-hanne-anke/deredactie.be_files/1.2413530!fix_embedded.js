$(document).ready(function () {
	$('iframe[data-tweet-id]').livequery(function(){
		$(this).each(function () {
			var tweet_id = $(this).attr('data-tweet-id');
			if ($('iframe[data-tweet-id='+ tweet_id +']').size() > 1) {
				$('iframe[data-tweet-id='+ tweet_id +']:not(:eq(0))').remove();
			}
		});
	});
});