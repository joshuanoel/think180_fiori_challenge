sap.ui.define([], function () {
	"use strict";
	return {

        // Take a score from 0-5 and return a sap.ui.core.ValueState property.
        reviewScoreToValueState: function(iScore) {
            if (iScore >= 0 && iScore <= 2) {
                return "Error";
            } else if (iScore <= 4) {
                return "Warning";
            } else if (iScore <= 5) {
                return "Success";
            }
            return "None";
        },

        // Take a score from 0-5 and return a sap.m.ValueColor property.
        reviewScoreToValueColor: function(iScore) {
            if (iScore >= 0 && iScore <= 2) {
                return "Error";
            } else if (iScore <= 4) {
                return "Critical";
            } else if (iScore <= 5) {
                return "Good";
            }
            return "None";
        }
	};
});