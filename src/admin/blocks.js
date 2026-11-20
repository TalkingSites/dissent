// This site's own SpaceDash blocks: each section of a page is a small form in the editor.
// Every block writes the same code the pages use:
//   {% set sectionTitle = "..." %}
//   {% include "partials/textPhoto.njk" %}
// All of a block's values are always written, even empty ones, so one block's text can't
// carry over into the next block on the page.
(function () {
  var text = (name, label, extra) => Object.assign({ name: name, label: label, widget: "string", required: false }, extra);
  var long = (name, label, extra) => Object.assign({ name: name, label: label, widget: "text", required: false }, extra);
  var rich = (name, label, extra) => Object.assign({ name: name, label: label, widget: "markdown", buttons: ["bold", "italic", "link", "bulleted-list"], editor_components: [], required: false }, extra);
  var image = (name, label) => ({ name: name, label: label, widget: "image", required: false });
  var pick = (name, label, options, value) => ({ name: name, label: label, widget: "select", options: options, default: value, required: false });
  var yes = (name, label) => ({ name: name, label: label, widget: "boolean", default: false, required: false });

  var heading = text("sectionTitle", "Heading");
  var linkText = text("sectionLinkText", "Link text");
  var linkUrl = text("sectionLinkUrl", "Link address", { hint: "e.g. /whats-on/ or https://..." });
  var alt = text("sectionAlt", "Describe the photo", { hint: "For people who can't see it" });
  var linkStyle = pick("sectionLinkStyle", "Link style", [{ label: "Text with an arrow", value: "arrow" }, { label: "Button", value: "button" }], "arrow");

  var blocks = [
    { id: "hero", label: "Big opening", file: "hero", summary: "heroTitle", fields: [
      text("heroTitle", "Heading"), long("heroLead", "Intro"),
      image("heroImage", "Background photo"), text("heroAlt", "Describe the photo"),
      text("heroAction", "Button text"), text("heroLink", "Button address"),
      text("heroAction2", "Second button text"), text("heroLink2", "Second button address"),
      text("heroStamp", "Red stamp", { hint: "A few words, e.g. Est. 2024" }),
    ] },
    { id: "ticker", label: "Scrolling strip", file: "ticker", summary: "tickerText", fields: [
      text("tickerText", "Words", { hint: "Separate them with commas" }),
    ] },
    { id: "pageHead", label: "Page heading", file: "pageHead", summary: "headTitle", fields: [
      text("headTitle", "Heading"), long("headLead", "Intro"), image("headImage", "Background photo"),
    ] },
    { id: "gigs", label: "Gig list", file: "gigs", summary: "sectionTitle", fields: [
      heading, rich("sectionText", "Text when nothing's booked"), linkText, linkUrl, linkStyle,
      pick("gigLimit", "How many", [{ label: "Next 4", value: "4" }, { label: "Next 8", value: "8" }, { label: "All", value: "all" }], "4"),
      yes("gigPast", "Also show past gigs"),
    ] },
    { id: "textPhoto", label: "Text and photo", file: "textPhoto", summary: "sectionTitle", fields: [
      heading, rich("sectionText", "Text"), linkText, linkUrl, linkStyle,
      image("sectionImage", "Photo"), alt,
      pick("sectionLayout", "Photo side", [{ label: "Right", value: "right" }, { label: "Left", value: "left" }], "right"),
      pick("sectionBg", "Background", [{ label: "Black", value: "" }, { label: "Charcoal", value: "band-ink" }], ""),
    ] },
    { id: "photoStrip", label: "Four photos", file: "photoStrip", fields: [
      image("stripImage1", "Photo 1"), text("stripAlt1", "Describe photo 1"),
      image("stripImage2", "Photo 2"), text("stripAlt2", "Describe photo 2"),
      image("stripImage3", "Photo 3"), text("stripAlt3", "Describe photo 3"),
      image("stripImage4", "Photo 4"), text("stripAlt4", "Describe photo 4"),
    ] },
    { id: "callout", label: "Red callout", file: "callout", summary: "sectionTitle", fields: [
      heading, rich("sectionText", "Text"), linkText, linkUrl,
    ] },
    { id: "bigQuote", label: "Big quote", file: "bigQuote", summary: "quoteBy", fields: [
      long("quoteText", "Quote"), text("quoteBy", "Who or where it's from"), text("quoteLink", "Link address"),
    ] },
    { id: "findUs", label: "Find us", file: "findUs", summary: "sectionTitle", fields: [
      heading, rich("sectionText", "Text", { hint: "The address, email and social links come from Settings" }),
    ] },
  ];

  var VALUE = '"(?:[^"\\\\]|\\\\.)*"';

  blocks.forEach(function (b) {
    var names = b.fields.map(function (f) { return f.name; });
    var include = '{% include "partials/' + b.file + '.njk" %}';
    var sets = names.length ? "(?:{%\\s*set\\s+(?:" + names.join("|") + ")\\s*=\\s*" + VALUE + "\\s*%}\\s*\\n?)*" : "";
    var booleans = b.fields.filter(function (f) { return f.widget === "boolean"; }).map(function (f) { return f.name; });

    window.CMS.registerEditorComponent({
      id: "site-" + b.id,
      label: b.label,
      fields: b.fields,
      collapsed: true,
      summary: b.summary ? "{{fields." + b.summary + "}}" : undefined,
      pattern: new RegExp("^" + sets + '{%\\s*include\\s+"partials/' + b.file + '\\.njk"\\s*%}'),
      fromBlock: function (match) {
        var data = {};
        var re = /{%\s*set\s+(\w+)\s*=\s*("(?:[^"\\]|\\.)*")\s*%}/g;
        var m;
        while ((m = re.exec(match[0]))) data[m[1]] = JSON.parse(m[2]);
        booleans.forEach(function (k) { data[k] = data[k] === "yes"; });
        return data;
      },
      toBlock: function (data) {
        var lines = names.map(function (k) {
          var v = data[k];
          if (booleans.indexOf(k) > -1) v = v ? "yes" : "no";
          return "{% set " + k + " = " + JSON.stringify(String(v == null ? "" : v)) + " %}";
        });
        return lines.concat(include).join("\n");
      },
      toPreview: function () { return "<strong>" + b.label + "</strong>"; },
    });
  });
})();
