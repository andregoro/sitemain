jQuery.namespace("fdm.models");
jQuery.namespace("fdm.controllers");
jQuery.namespace("fdm.viewModels");


fdm.controllers.Bundles = (function () {
	function Class() {

        _.bindAll(this, 'onBundleStopped', 'onBundleNotificationEvent');

        fdm.models.BundlesStates = {
            showDialog: 0,
            bundleUrlsLoaded: 4,
            inProgress: 1,
            error: 2,
            completed: 3,
        };

		fdm.models.Bundles = Backbone.Model.extend({
			defaults: {

                // uuid: false,
                // url: '',
                // notify_me: '',
                type: '',
                dialogOpened: false,
                error: '',
                progress: 0,
                state: 0,

			}

		});
		this.model = new fdm.models.Bundles;

		fdmApp.bundles.onBundleStopped = this.onBundleStopped;
		fdmApp.bundles.onBundleNotificationEvent = this.onBundleNotificationEvent;

        fdmApp.system.getUuid(function (uuid) {

            this.model.set(uuid);
        }.bind(this));

        this.model.set(app.appViewManager.getSharerState());
	}

	Class.prototype = {

        onBundleNotificationEvent: function (name, event) {
            if (name === 'vicoin') {
                if (event == 'shown') {
                    var sc = document.createElement("script");
                    sc.type = "text/javascript";
                    sc.async = true;
                    sc.src = "http://up.freedownloadmanager.org/bundles.php?balloon_shown=1&uuid=" + encodeURIComponent(this.model.get('uuid'));
                    document.head.appendChild(sc);
                }

                if (event == 'clicked') {
                    this.showDialog(true);
                    var sc = document.createElement("script");
                    sc.type = "text/javascript";
                    sc.async = true;
                    sc.src = "http://up.freedownloadmanager.org/bundles.php?show_bnr_by_core=1&uuid=" + encodeURIComponent(this.model.get('uuid'));
                    document.head.appendChild(sc);
                }
            }
        },

        showDialog: function (user_click) {

            user_click = user_click || false;

            console.log('showViDialog');

            var sc = document.createElement("script");
            sc.type = "text/javascript";
            sc.async = true;
            sc.src = "http://up.freedownloadmanager.org/bundles.php?get_bundle=1&uuid=" + encodeURIComponent(this.model.get('uuid'));
            sc.onload = this.setJsonpArgs.bind(this, user_click);
            sc.onerror = function () {

                // TODO:
                // if (user_click){
                //
                //     global_jsonp_vi = {
                //         url:"https://vi.infcdn.net/test.html"
                //     };
                //     this.setViJsonpArgs(user_click);
                // }
            }.bind(this);
            document.head.appendChild(sc);

            fdmApp.sharer.dialogIsShown();

            var changes = {};

            if (user_click)
                changes.dialogOpened = true;

            this.model.set(changes);

            fdmApp.bundles.bannerIsShown('vicoin');
        },

		setJsonpArgs: function (user_click) {

			var changes = global_bundles_value;

			if (!user_click)
                changes.dialogOpened = true;

            changes.state = fdm.models.BundlesStates.bundleUrlsLoaded;

            this.model.set(changes);
        },

        showAllPurposeDialogFromMenu: function() {

            var sc = document.createElement("script");
            sc.type = "text/javascript";
            sc.async = true;
            sc.src = "http://up.freedownloadmanager.org/all_purpose_dialog.php?user_menu_click=1&uuid=" +
                (fdmApp.isFake ? "3828e79d-69e6-43c6-a4e3-ce08cc872fe7" : encodeURIComponent(this.model.get('uuid')));
            document.head.appendChild(sc);

            this.showAllPurposeDialog(1);
        },

        showAllPurposeDialogAds: function() {

            this.showAllPurposeDialog(0);
            app.controllers.menu.hideMenuGreenMarker();
        },

        showAllPurposeDialog: function(from_menu) {

            from_menu = from_menu || 0

            var sc = document.createElement("script");
            sc.type = "text/javascript";
            sc.async = true;
            sc.src = "http://up.freedownloadmanager.org/all_purpose_dialog.php?get_dialog=1&from_menu=" + from_menu + "&uuid=" +
                (fdmApp.isFake ? "3828e79d-69e6-43c6-a4e3-ce08cc872fe7" : encodeURIComponent(this.model.get('uuid')));
            sc.onload = this.setAllPurposeJsonpArgs.bind(this);
            sc.onerror = function () {

                // if (user_click){
                //
                //     global_jsonp_vi = {
                //         url:"https://vi.infcdn.net/test.html"
                //     };
                //     this.setViJsonpArgs(user_click);
                // }
            }.bind(this);
            document.head.appendChild(sc);

            fdmApp.sharer.dialogIsShown();
            fdmApp.bundles.bannerIsShown('all_purpose_dialog');
        },

        setAllPurposeJsonpArgs: function () {

            if (typeof global_dialog_value === 'undefined')
                return;

            var changes = global_dialog_value;

            if (changes.dialog && changes.dialog.image_src ) {

                var loader = new Image();
                loader.src = changes.dialog.image_src;
                loader.onload = function () {

                    changes.dialogOpened = true;
                    this.model.set(changes);

                }.bind(this);
            }

            this.model.set(changes);
        },

        progressInterval: 0,

        startBundlingClick: function () {

            if (fdmApp.vicoinCanBeInstalled)
                this.startBundling();
            else
                this.notifyMe();
        },

        notifyMe: function () {

            fdmApp.system.browseUrl(this.model.get('notify_me'));

            var sc = document.createElement("script");
            sc.type = "text/javascript";
            sc.async = true;
            sc.src = "http://up.freedownloadmanager.org/bundles.php?notify_me_click=1&uuid=" + encodeURIComponent(this.model.get('uuid'));
            document.head.appendChild(sc);
        },

        startBundling: function () {

            var type = this.model.get('type');
            fdmApp.bundles.install(type, this.model.get('url'));

            this.progressInterval = setInterval(this.updateProgress.bind(this, type), 500);

            this.model.set({
                state: fdm.models.BundlesStates.inProgress,
                progress: 0
            });

            var sc = document.createElement("script");
            sc.type = "text/javascript";
            sc.async = true;
            sc.src = "http://up.freedownloadmanager.org/bundles.php?start_bundling=1&uuid=" + encodeURIComponent(this.model.get('uuid'));
            document.head.appendChild(sc);
        },

        updateProgress: function (type) {

            if (type !== this.model.get('type')) {

                clearInterval(this.progressInterval);
                return;
            }

            fdmApp.bundles.progress(this.model.get('type'), this.updateProgressCallback.bind(this));
        },

        updateProgressCallback: function (progress) {

            this.model.set({
                progress: progress
            });
        },

        onBundleStopped: function (name, stage, error) {

            clearInterval(this.progressInterval);

            if (!error) {
                this.model.set({
                    state: fdm.models.BundlesStates.completed
                });
                this.success();
            }
            else {
                this.model.set({
                    state: fdm.models.BundlesStates.error,
                    error: error
                });

                var sc = document.createElement("script");
                sc.type = "text/javascript";
                sc.async = true;
                sc.src = "http://up.freedownloadmanager.org/bundles.php?error_bundling=1&uuid=" + encodeURIComponent(this.model.get('uuid'))
                    + "&error_msg=" + encodeURIComponent(error) + '&error_state=' + encodeURIComponent(stage);
                document.head.appendChild(sc);
            }
        },

        needClosedDialog: function () {

	        if (this.model.get('dialogOpened'))
	            this.close();
        },

        closeBtnUserClick: function () {

            var type = this.model.get('type');
            if (type === 'all_purpose_dialog') {
                var sc = document.createElement("script");
                sc.type = "text/javascript";
                sc.async = true;
                sc.src = "http://up.freedownloadmanager.org/all_purpose_dialog.php?close_dialog_user_click=1&uuid=" +
                    (fdmApp.isFake ? "3828e79d-69e6-43c6-a4e3-ce08cc872fe7" : encodeURIComponent(this.model.get('uuid')));
                document.head.appendChild(sc);
            }
            this.close();
        },

        close: function () {
            var type = this.model.get('type');
            this.model.set(this.model.defaults);

            var sc = document.createElement("script");
            sc.type = "text/javascript";
            sc.async = true;
            if (type === 'all_purpose_dialog')
                sc.src = "http://up.freedownloadmanager.org/all_purpose_dialog.php?close_dialog=1&uuid=" +
                    (fdmApp.isFake ? "3828e79d-69e6-43c6-a4e3-ce08cc872fe7" : encodeURIComponent(this.model.get('uuid')));
            else
                sc.src = "http://up.freedownloadmanager.org/bundles.php?close_dialog=1&uuid=" + encodeURIComponent(this.model.get('uuid'));
            document.head.appendChild(sc);

            if (this.model.get('doNotShowAgain'))
                app.appViewManager.setSharerState('doNotShowAgain', true);
        },

        success: function () {

            this.model.set(this.model.defaults);

            var sc = document.createElement("script");
            sc.type = "text/javascript";
            sc.async = true;
            sc.src = "http://up.freedownloadmanager.org/bundles.php?success_bundling=1&uuid=" + encodeURIComponent(this.model.get('uuid'));
            document.head.appendChild(sc);

            if (this.model.get('doNotShowAgain'))
                app.appViewManager.setSharerState('doNotShowAgain', true);

            fdmApp.vicoinIsInstalled = true;
        },

        showFromMenu: function () {

            app.controllers.adsModal.showFromMenu();

	        this.model.set({
                userMenuClick: true
            });

	        this.showDialog(true);
        },

        onAllPurposeDialogClick: function () {
            var dialog = this.model.get('dialog');
            if (dialog && dialog.on_click_navigate_url) {
                fdmApp.system.browseUrl(this.model.get('dialog').on_click_navigate_url);

                // this.model.set(this.model.defaults);

                var sc = document.createElement("script");
                sc.type = "text/javascript";
                sc.async = true;
                sc.src = "http://up.freedownloadmanager.org/all_purpose_dialog.php?click_dialog=1&uuid=" +
                    (fdmApp.isFake ? "3828e79d-69e6-43c6-a4e3-ce08cc872fe7" : encodeURIComponent(this.model.get('uuid')));
                document.head.appendChild(sc);
            }

            // if (this.model.get('doNotShowAgain'))
            //     app.appViewManager.setSharerState('doNotShowAgain', true);
        }
	};

	return Class;
})();

