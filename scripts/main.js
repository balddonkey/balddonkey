$(function() {
  console.log("hahahaha");
  $(".addli").click(function() {
    console.log($(this).text());
    $(".heiul").append("<li class=\"heili\">Row 0</li>");
  });
});