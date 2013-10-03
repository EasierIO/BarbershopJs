(function($) {
  "use strict";
  /*
  glocal vars
  */
  var fileReader = new FileReader();
  var activeRange = false;

  /*
  window event listeners
  */

  $.fn.odysseus = function() {

    debug("initted!");
    disableSpellCheck();
    initBrowserDependentSettings();
    initContentEditables();
    createStylingBar()
    initStylingBar();
    initImagePlaceholders();
    initWindow();
  };

  function initWindow() {
    $(window).mouseup(function(e) {
      if ($(e.target).parents().is("#bs-stylingBar"))
        return;

      if (!(getSelectionLength() > 0 && document.activeElement.isContentEditable && elementIsStyleable(document.activeElement)))
        return $("#bs-stylingBar").hide();

      showStylingBar();
    });
  }

  function disableSpellCheck() {
    $('body').attr("spellcheck", false);
  }

  function initBrowserDependentSettings() {
    if (navigator.userAgent.indexOf("Firefox") !== -1) {
      $("[contenteditable='plaintext-only']").attr("data-contenteditable", "plaintext-only");
      $("[contenteditable='plaintext-only']").attr("contenteditable", "true")
    }
  }

  function initImagePlaceholders() {
    $(".bs-image-placeholder").click(function() {
      var container = this;
      var fileInput = $('<input type="file" accept="image/*" multiple/>');
      fileInput.bind("change", function(e) {
        $(self).css({
          "bs-background-image": "url(images/ajax-loader.gif)"
        });
        processImages(e.target.files, container);
      });
      fileInput.trigger("click");
    });
  }

  function initContentEditables() {

    $("[contenteditable]").keyup(function() {
      if ($(this).text().length === 0) {
        $(this).empty();
      }
    });

    $("[contenteditable='true']").bind("paste", function(e) {
      var self = $(this);
      setTimeout(function() {
        var html = $(self).html()
          .replace(/<\/div><div><br><\/div><div>/gi, "</p><p>")
          .replace(/^<p.*?>/, "")
          .replace(/<\/p>$/, "");

        var cleanHTML = $.htmlClean(html, {
          format: true,
          allowedTags: ["a", "p", "br", "b", "strong", "em", "ul", "li", "ol", "i", "s", "u"]
        });
        $(self).html(cleanHTML);
      }, 0);
    });
  }

  function debug(str) {
    //return;
    console.log(str);
  }

  function exec(cmd, two, three) {
    document.execCommand(cmd, false, three || null);
  }

  function insertHTML(elementName) {
    document.execCommand('insertHTML', false, "<" + elementName + ">" + window.getSelection() + "</" + elementName + ">")
  }

  function getBrowserContainer() {
    return (navigator.userAgent.indexOf("Firefox") !== -1) ? "html" : "body";
  }

  function elementIsStyleable(elem) {
    return (navigator.userAgent.indexOf("Firefox") !== -1) ? ($(elem).data("contenteditable") != "plaintext-only") : ($(elem).attr("contenteditable") == "true");
  }

  function getSelectionLength() {
    return window.getSelection().toString().length;
  }

  function getSelectionRange() {
    activeRange = window.getSelection().getRangeAt(0);
    return activeRange;
  }

  function getStylingBarPosition(range) {
    if (range.getClientRects()[0].width === 0) {
      return {
        top: range.getClientRects()[1].top - 50 + $(getBrowserContainer()).scrollTop(),
        left: range.startContainer.parentElement.offsetLeft
      }
    }

    return {
      top: range.getClientRects()[0].top - 50 + $(getBrowserContainer()).scrollTop(),
      left: range.getClientRects()[0].left
    }
  }

  function createStylingBar() {
    $("body").append($(
      '<div id="bs-stylingBar">' +
      '<div id="bs-stylingBar-inner">' +
      '<a class="bs-style bs-style-bold"><b>B</b></a>' +
      '<a class="bs-style bs-style-italic"><i>I</i></a>' +
      '<a class="bs-style bs-style-underline"><u>U</u></a>' +
      '<a class="bs-style bs-style-strikethrough"><s>S</s></a>' +
      '<a class="bs-format bs-format-h2">H2</a>' +
      '<a class="bs-format bs-format-h3">H3</a>' +
      '<a class="bs-format bs-format-link"><img src="images/link.png"></a>' +
      '<input type="text" id="bs-selection-link" placeholder="type in a link"/>' +
      '</div>' +
      '</div>'
    ));
  }

  function initStylingBar() {
    $("#bs-stylingBar a").attr("href", "javascript:void(0);");
    $("#bs-stylingBar a.bs-style-bold").click(function() {
      exec('bold');
    });
    $("#bs-stylingBar a.bs-style-italic").click(function() {
      exec('Italic');
    });
    $("#bs-stylingBar a.bs-style-underline").click(function() {
      exec('Underline');
    });
    $("#bs-stylingBar a.bs-style-strikethrough").click(function() {
      exec('StrikeThrough');
    });
    $("#bs-stylingBar a.bs-format-h2").click(function() {
      insertHTML('h2');
    });
    $("#bs-stylingBar a.bs-format-h3").click(function() {
      insertHTML('h3');
    });
    $("#bs-stylingBar a.bs-format-link").click(function() {
      showLinkBox();
    });

    $("input#selection-link").keypress(function(e) {
      if (e.which === 13) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(activeRange);
        $("#bs-stylingBar").stop().animate({
          scrollLeft: 0,
        }, 100, function() {
          if ($("input#bs-selection-link").val().length === 0)
            return document.execCommand('insertHTML', false, '<span>' + sel + '</span>');
          document.execCommand('insertHTML', false, "<a href='" + $("input#bs-selection-link").val() + "' target='_blank'>" + sel + "</a>");
          $("input#bs-selection-link").val("");
        });
      }
    });
  }

  function showStylingBar() {
    var range = getSelectionRange();
    var stylingBarPosition = getStylingBarPosition(range);
    $("#bs-stylingBar")
      .css({
        top: stylingBarPosition.top,
        left: stylingBarPosition.left,
        width: "252px"
      })
      .animate({
        scrollLeft: 0,
      }, 10)
      .show();
  }

  function showLinkBox() {
    $("#bs-stylingBar")
      .stop()
      .animate({
        scrollLeft: 202
      }, 300);
    $("#bs-stylingBar-inner input").trigger("focus");
    if (activeRange.startContainer.parentElement.href)
      return $("input#bs-selection-link").val(activeRange.startContainer.parentElement.href)
    $("input#bs-selection-link").val("")
  }

  function processImages(images, container) {
    var n = images.length,
      numProcessed = 0;
    for (var i = 0; i < n; i++) {
      processImage(images[i], function(data) {
        var img = $('<img src="' + data + '"/>');
        img.load(function() {
          $(container).append($(img));
          numProcessed++;
          if (numProcessed == n) {
            $(container).animate({
              height: img.height()
            }, 300);
          }
        });
      });
    }
  }

  function processImage(el, callback) {
    var self = el;
    fileReader.onload = function(e) {
      return callback(e.target.result);
    }
    fileReader.readAsDataURL(el);
  }

}(jQuery));