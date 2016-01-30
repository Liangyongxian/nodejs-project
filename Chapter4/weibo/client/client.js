Session.setDefault("info", {success: "", error: ""});

Template.container.helpers({
	currentUrl : function() {
		return Session.get("currentUrl");
	}
});

Template.nav.helpers({
	active : function() {
		return Session.get("currentUrl");
	}
});

Template.info.helpers({
	info: function() {
		return Session.get("info");
	}
});

var urlRouter = Backbone.Router.extend({
	routes: {
		"": "index",
		"login": "login",
		"reg": "reg",
		"logout": "logout"
	},
	index: function() {
		Session.set("currentUrl", {index: "active", login: "", reg: ""});
	},
	login: function() {
		if (Meteor.userId()) {
			this.navigate("/", true);
			Session.set("info", {success: "", error: "用户已在线"});
			return;
		}
		Session.set("currentUrl", {index: "", login: "active", reg: ""});
	},
	reg: function() {
		if (Meteor.userId()) {
			this.navigate("/", true);
			Session.set("info", {success: "", error: "用户已在线"});
			return;
		}
		Session.set("currentUrl", {index: "", login: "", reg: "active"});
	},
	logout: function() {
		if (Meteor.userId()) {
			Meteor.logout();
			this.navigate("/", true);
			Session.set("info", {success: "登出成功", error: ""});
			return;
		} else {
			this.navigate("/", true);
			Session.set("info", {success: "", error: "用户不在线"});
		}
	},
	redirect: function(url) {
		this.navigate(url, true);
	}
});


Router = new urlRouter;

Meteor.startup(function() {
	Backbone.history.start({pushState: true});
});

Template.reg.events({
	'click #submit': function(evt) {
		evt.preventDefault();
		var $username = $("#username").val();
		var $password = $("#password").val();
		var $password_repeat = $("#password-repeat").val();
		if ($password.length === 0 || $username.length === 0) {
			Session.set("info", {success: "", error: "用户名或密码不能为空"});
			return;
		}
		if ($password !== $password_repeat) {
			Session.set("info", {success: "", error: "两次输入密码不一致"});
			return;
		}

		Accounts.createUser({username: $("#username").val(), password: $("#password").val()}, function(err) {
			if (err) {
				Session.set("info", {success: "", error: err.reason});
			} else {
				Router.redirect("/");// 跳转至主页
				Session.set("info", {success: "注册成功", error: ""});
			}
		});
	}
});