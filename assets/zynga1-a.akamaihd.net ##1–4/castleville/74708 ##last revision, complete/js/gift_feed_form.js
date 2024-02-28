function GiftFeedForm(buttons, form, dataUrl, continueToUrl) {
	this.button = $(buttons['send']);
	this.skipButton = buttons['skip'] && $(buttons['skip']);
	this.form = $(form);
	this.dataUrl = dataUrl;
	this.continueToUrl = continueToUrl;
	
	this.button.click(bind(this.sendClicked, this));
	this.skipButton && this.skipButton.click(bind(this.afterPublish, this));
}

GiftFeedForm.prototype = {
	sendClicked: function() {
		$.getJSON(ZY.PrepareURL(this.dataUrl), this.form.serialize(), bind(this.publishStream, this));
		return false;
	},
	publishStream: function(data) {
		FB.Connect.streamPublish('',data.attachment,data.actionLink,data.targetId,data.userMessagePrompt,bind(this.afterPublish, this));
	},
	afterPublish: function() {
		redirect(this.continueToUrl);
		return false;
	}
};
