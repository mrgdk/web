// SOURCE FOR SORTING 
// https://www.willmaster.com/library/features/sorting-a-table-with-javascript.php

function compareTexts(a,b) {
  var aval = a.value;
  var bval = b.value;
  return( aval == bval ? 0 : (aval > bval ? 1 : -1) );
}

//Text comparison function

function compareNumbers(a,b) {
  var aval = /\d/.test(a.value) ? parseFloat(a.value) : 0;
  var bval = /\d/.test(b.value) ? parseFloat(b.value) : 0;
  return( aval == bval ? 0 : (aval > bval ? 1 : -1) );
}

//Number comparison function

var lastSortedColumn = -1;


function SortTable() {
  var columnNumber = parseInt(arguments[0]);
  var dataType = arguments.length > 1 ? arguments[1] : 'T';
  var phoneTable = document.getElementById("phoneTable");
  var body = phoneTable.getElementsByTagName("tbody")[0];
  var rows = body.getElementsByTagName("tr");
  var allRows = new Array();
  dataType = dataType.toUpperCase();

  for (var i = 0; i < rows.length; i++) {
      allRows[i] = new Object;
      allRows[i].oldIndex = i;
      var text = rows[i].getElementsByTagName("td")[columnNumber].innerHTML.replace(/<[^>]*>/g,"");
    if(dataType == 'D') {
      allRows[i].value = GetDateSortingKey(dateformat,text);
    }

    else {
      var re = dataType=="N" ? /[^\.\-\+\d]/g : /[^a-zA-Z0-9]/g;
      allRows[i].value = text.replace(re,"").substr(0,25).toLowerCase();
    }
  }

  if (columnNumber == lastSortedColumn) {
    allRows.reverse();
  }

  else {
    lastSortedColumn = columnNumber;
    switch(dataType) {
      case "N" : allRows.sort(compareNumbers); break;
      case "D" : allRows.sort(compareNumbers); break;
      default  : allRows.sort(compareTexts);
    }
  }

  var newTableBody = document.createElement("tbody");
  for (var i = 0, len = allRows.length; i<len; i++) {
    newTableBody.appendChild(rows[allRows[i].oldIndex].cloneNode(true));
  }
  phoneTable.replaceChild(newTableBody,body);
}
//Actual sort function, passed 2 parameters initially
//first one is for the column number, second one is the data type ('N' for numbers, 'T' for texts)






$('#search').click(() => {
  $('#info').empty();
  $('#info').removeClass('hidden');
  $('#errorMessage').html('');
  var productId = $('#id').val();
  var dataText = "";
  if (productId){
      const reqURL = 'api/get/' + productId;

    $.ajax({
      url: reqURL,
      type: 'GET',
      dataType: 'json',
      success: (data) => {
        if(data.image && data.brand && data.model && data.os && data.screensize){
          dataText += dataText += "<img alt='"+ data.model +"' src='"+ data.image +"' class='bestsellerimage'>"+
            "<p>Product Brand: "+data.brand+"</p>"+ "<p>Product Model:"+data.model+"</p>"+
            "<p>Product OS:"+data.os+"</p>"+"<p>Product Screensize:"+data.screensize+"</p>";
          $('#info').append(dataText);
          $('#updateSection').removeClass("hidden");
          $('#delete').removeClass("hidden");
          $('#updateImage').val(data.image);
          $('#updateBrand').val(data.brand);
          $('#updateModel').val(data.model);
          $('#updateOS').val(data.os);
          $('#updateScreensize').val(data.screensize);
        }
        else{
          $('#errorMessage').html('There is no item with id:' + productId);
          $('#updateSection').addClass('hidden');
          $('#delete').addClass('hidden');

        }
      }

    });
  }
  else{
    $('#errorMessage').html('Enter an id !!!');
  }
});



$('#update').click(() => {
  if($('#updateImage').val() && $('#updateBrand').val() && $('#updateModel').val() && $('#updateOS').val() && $('#updateScreensize').val()){
    $.ajax({
      url: 'api/update',
      type: 'PUT',
      dataType: 'json',
      data: {
        id: $('#id').val(),
        image: $('#updateImage').val(),
        brand: $('#updateBrand').val(),
        model: $('#updateModel').val(),
        os: $('#updateOS').val(),
        screensize: $('#updateScreensize').val(), 
      },
      success: (data) => {
        $('#errorMessage').html(data.message);
        $('#info').html('');
        $('#updateSection').addClass('hidden');
        $('#delete').addClass('hidden');
        $('#id').val('');
      }
    });
    
    $('#tablebody').empty();
    $.getJSON("api/fetch/", function(data){
    var dataText = "";
    $.each(data, function(k,v){
      dataText +="<tr>"+ "<td><img alt='"+ v.model +"' src='"+ v.image +"' class='bestsellerimage'></td>"+
      "<td>"+v.brand+"</td>"+ "<td>"+v.model+"</td>"+
      "<td>"+v.os+"</td>"+"<td>"+v.screensize+"</td>";
    });

    $("#tablebody").append(dataText);
    });
  }
  else{
    $('#errorMessage').html('You need to fill up every box!!');
  }
});


$('#delete').click(() => {
  const userId = $('#id').val();

  $.ajax({
      url: 'api/delete',
      type: 'DELETE',
      data: {
        id: userId,
      },
      success: (data) => {
        $('#errorMessage').html(data.message);
        $('#updateSection').addClass('hidden');
        $('#delete').addClass('hidden');
        $('#info').addClass('hidden');
        $('#id').val('');
      }
  });
  $('#tablebody').empty();
  $.getJSON("api/fetch/", function(data){
  var dataText = "";
  $.each(data, function(k,v){
    dataText +="<tr>"+ "<td><img alt='"+ v.model +"' src='"+ v.image +"'></td>"+
    "<td>"+v.brand+"</td>"+ "<td>"+v.model+"</td>"+
    "<td>"+v.os+"</td>"+"<td>"+v.screensize+"</td>";
  });

  $("#tablebody").append(dataText);
  });
});


$("#resetData").click(function() {
  $.ajax({
    url: 'api/reset/',
    type: 'DELETE',
    success: (data) => {
      $('#errorMessage').html(data.message);
      $('#delete').addClass('hidden');
      $('#updateSection').addClass('hidden');
    }
  });
  
  alert("Data has been deleted!");

  $('#tablebody').empty();
  $.getJSON("api/fetch/", function(data){
  var dataText = "";
  $.each(data, function(k,v){
    dataText +="<tr>"+ "<td><img alt='"+ v.model +"' src='"+ v.image +"'></td>"+
    "<td>"+v.brand+"</td>"+ "<td>"+v.model+"</td>"+
    "<td>"+v.os+"</td>"+"<td>"+v.screensize+"</td>";
  });

  $("#tablebody").append(dataText);
  });

});

//Reset button, to be able to update the table, it needs to reload the table right after the reset button

$('#fetchAll').click(() => {
  $('info').removeClass('hidden');
  $.ajax({
    url: 'api/fetchAll/',
    type: 'GET',
    dataType: 'json',
    success: (data) => {
      $('#info').html("All product id's: " + data);
      $('#delete').addClass('hidden');
      $('#updateSection').addClass('hidden');
    }
  });
});


$(document).ready(function(){
  $.getJSON("api/fetch/", function(data){
    var dataText = "";
    $.each(data, function(k,v){
      dataText +="<tr>"+ "<td><img alt='"+ v.model +"' src='"+ v.image +"'></td>"+
      "<td>"+v.brand+"</td>"+ "<td>"+v.model+"</td>"+
      "<td>"+v.os+"</td>"+"<td>"+v.screensize+"</td>";
    });

    $("#phoneTable").append(dataText);
  });
});


//Fetch the data from database and place them in the speficied order in the table by creating new rows.


$("#create").click(() => {
  if($('#imageInput').val() && $('#brandInput').val() && $('#modelInput').val() && $('#osInput').val() && $('#screensizeInput').val()){
    $.ajax({
      url : 'api/create',
      type: 'POST',
      dataType: 'json',
      data: {
          image: $('#imageInput').val(),
          brand: $('#brandInput').val(),
          model: $('#modelInput').val(),
          os: $('#osInput').val(),
          screensize: $('#screensizeInput').val(),
      },
      success: (data) => {
        $('#info').html('The item has been successfully created');
        $('#imageInput').val('');
        $('#brandInput').val('');
        $('#modelInput').val('');
        $('#osInput').val('');
        $('#screensizeInput').val('');
      }
    });

    $('#tablebody').empty();
    $.getJSON("api/fetch/", function(data){
    var dataText = "";
    $.each(data, function(k,v){
      dataText +="<tr>"+ "<td><img alt='"+ v.model +"' src='"+ v.image +"'></td>"+
      "<td>"+v.brand+"</td>"+ "<td>"+v.model+"</td>"+
      "<td>"+v.os+"</td>"+"<td>"+v.screensize+"</td>";
    });

    $("#tablebody").append(dataText);
    });

  }
  else{
    $('#errorMessage').html('You need to fill up every box!!');
  }
});

//Once user submission is performed, the necessary data held in database is fetched and place onto the table,
//without reloading the page, it creates new row and places the new data elements in the appropriate place.



const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}








