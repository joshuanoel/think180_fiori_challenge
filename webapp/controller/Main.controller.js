sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "T180/fiorichallenge/model/models",
    "T180/fiorichallenge/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, models, formatter) {
        "use strict";

        return Controller.extend("T180.fiorichallenge.controller.Main", {

            // Give the view access to formatter functions from model/formatter.js
            formatter: formatter,

            onInit: function () {

            },

            onAfterRendering: function () {
                // Instantiate the Asset Review Model from the models.js template
                this.getView().setModel(new JSONModel(models.createAssetReviewModelTemplate()), "AssetReviewModel");

                // Example; setting the 'CurrentDate' property in the Asset Review model
                this.getView().getModel("AssetReviewModel").setProperty("/CurrentDate", new Date());

                // Add new "AverageScore" property to each review in the Asset Review model.
                this.getView().getModel("AssetReviewModel").setProperty(
                    "/Reviews", 
                    this.setAverageReviewScores(this.getView().getModel("AssetReviewModel").getProperty("/Reviews"))
                );
                // Refresh expression bindings (ie. average score bar graph sorting), as this function runs after rendering.
                this.getView().getModel("AssetReviewModel").refresh(true);
            },

            // Opens the dialog for creating a new review.
            openNewReviewDialog: function() {
                if (this.newReviewDialog === undefined) {
                    this.newReviewDialog = this.loadFragment({
                        name: "T180.fiorichallenge.view.CreateReviewDialog"
                    });
                }
                this.getView().setModel(new JSONModel(models.createNewReviewModelTemplate()), "NewReviewModel");
                this.newReviewDialog.then(function(oDialog) {
                    oDialog.open();
                });
            },

            // Closes the dialog for creating a new review.
            closeNewReviewDialog: function() {
                if (this.newReviewDialog !== undefined) {
                    this.newReviewDialog.then(function(oDialog) {
                        oDialog.close();
                    });
                }
            },

            // Adds a new entry to AssetReviewModel>/Reviews based on the data in the NewReviewModel.
            // Data in the NewReviewModel is bound to the user inputs in the new review dialog.
            createNewReviewFromDialog: function() {
                var aReviews = this.getView().getModel("AssetReviewModel").getProperty("/Reviews");
                var oNewReview = this.getView().getModel("NewReviewModel").getProperty("/");

                oNewReview.SubmittedBy = sap.ushell.Container.getService("UserInfo").getId();
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern: "yyyy-MM-ddTHH:mm:ss.SSS Z"
                });
                oNewReview.SubmissionDate = oDateFormat.format(new Date());

                aReviews.push(oNewReview);
                aReviews = this.setAverageReviewScores(aReviews);
                this.getView().getModel("AssetReviewModel").setProperty("/Reviews", aReviews);

                // Refresh expression bindings (ie. reviews array length) in the view.
                this.getView().getModel("AssetReviewModel").refresh(true);

                this.closeNewReviewDialog();
            },

            // For each entry in the review array, add/update the "AverageScore" property.
            setAverageReviewScores: function(aReviews) {
                aReviews.forEach(function(oReview) {
                    oReview.AverageScore = (oReview.Suitability + oReview.Value + oReview.Durability + oReview.Longevity)/4;
                });
                return aReviews;
            }

        });
    });
