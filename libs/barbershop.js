(function($) {

  "use strict";

  /*
  barbershopjs
  */

  $.fn.barbershop = function() {

    var that = this;

    $(that).find("[contenteditable]").each(function() {
      $(this).attr("data-uuid", uuid());
    });

    $(that).sortable({
      axis: "y",
      cursor: "move"
    });

    $(that).find("[contenteditable]").on("mouseover", function() {
      $(this).css({
        cursor: ($(document.activeElement).data("uuid") === $(this).data("uuid")) ? "text" : "move"
      });
    });

    $(that).find("[contenteditable]").on("mousedown", function() {
      if ($(document.activeElement).data("uuid") === $(this).data("uuid")) {
        console.log("active element  = mousedown element");
        $(that).sortable("sort");
        $(that).sortable("destroy");
      } else {
        $(that).sortable({
          axis: "y",
          cursor: "move"
        });
        console.log("active element  != mousedown element");
        console.log("active element = #" + $(document.activeElement).attr("id"));
      }
    });

    $(that).find("[contenteditable]").mouseup(function() {
      $(that).sortable("sort");
      $(that).sortable("destroy");
    });

    $(that).find("[contenteditable]").click(function() {
      $(this).trigger("focus");
      $(this).css({
        cursor: "text"
      });
      $(that).sortable("destroy");
      console.log("active element = #" + $(document.activeElement).attr("id"));
    });
  };

  var uuid = function(separator) {
    var delim = separator || "-";
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
  };

}(jQuery));