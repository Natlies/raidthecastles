/**
 * File Name: progress_bar.js
 *
 * © 2010 Zynga Game Network Inc.
 */

function ProgressBar(initUrl, updateUrl) {
	this.initUrl = initUrl;
	this.updateUrl = updateUrl;
	this.socialBar = $('#socialBar');
	this.progressBar = $('#progressBar');
	this.countdown = $('#socialBarCountdown');
	this.callout = $('#socialBarCallout');
	this.complete = $('#socialBarComplete');
	this.fanBox = $('#fanBox');
	this.steps = {
		bookmarked: $('#pBarStepBookmark'),
		fan: $('#pBarStepFan'),
		email: $('#pBarStepSubscribe'),
		publish_stream: $('#pBarStepPublish')
	};
	
	$.getJSON(ZY.PrepareURL(this.initUrl), bind(this.update, this));
	this.attachClickListeners();
}

ProgressBar.prototype = {
	attachClickListeners: function() {
		var that = this;
		$('#pBarStepBookmark .pBarAction a').click(function() {
			showBookmarkDialog(bind(that.trackProgressBar, that));
			return false;
		});
		
		$('#pBarStepFan .pBarAction a').click(bind(this.fanPopupClicked, this));
		
		$('#pBarStepSubscribe .pBarAction a').click(function() {
			showEmailPermission( bind(that.trackProgressBar, that) );
			return false;
		});
		
		$('#pBarStepPublish .pBarAction a').click(function() {
			showStreamPermissions( bind(that.trackProgressBar, that) );
			return false;
		});
		
		$('#closeFanBox').click(bind(this.closeFanPopup, this));
	},
	trackProgressBar: function() {
		$.getJSON(ZY.PrepareURL(this.updateUrl), bind(this.update, this));
	},
	update: function(data) {
		if (data.completed) {
			if (this.socialBar.is(":visible")) {
				this.complete.show();
			}
			this.socialBar.hide();
			this.callout.hide();
		} else {
			this.socialBar.show();
			this.callout.show();			

			var count = 1, widths = [124,256,386,515,648];

			for (var step in this.steps) {
				if (data[step] == 1) {
					this.steps[step].addClass('done');
					++count;
				} else {
					this.steps[step].removeClass('done');
				}
			}

			this.progressBar.css('width', widths[count - 1] + 'px').addClass("percent_" + (count * 20));
			this.countdown.text(5 - count);
		}
	},
	fanPopupClicked: function() {
		this.fanBox.show();
		return false;
	},
	closeFanPopup: function() {
		this.fanBox.hide();
		this.trackProgressBar();
		return false;
	}
};