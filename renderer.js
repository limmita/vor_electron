var $ = require('jquery')
var DG = require('2gis-maps');
var Datastore = require('nedb');
const electron = require('electron')
// window.Bootstrap = require('bootstrap');
const fs = require('fs')
var db = new Datastore({filename : 'users'});
db.loadDatabase();


let id, iconURL;
db.count({}, function (err, doc) {
        id = ++doc
    });

db.find({}, function (err, docs) {
});

var map = DG.map('map', {
    'center': [46.841, 30.800],
    'zoom': 8,
    fullscreenControl: false,
    zoomControl: false,
    minZoom: 8
});



var marker, lat, lng, pathFoto, pathFoto_name, pathFile, pathFile_name;
let flag = false;



map.on('click', function (event) {
    $('.btn').removeAttr("disabled")
    if (flag) {
        lat = event.latlng.lat
        lng = event.latlng.lng
        marker = DG.marker([lat, lng], {
                    draggable: true
                }).addTo(map);

                marker.on('drag', function(e) {
                    lat = e.target._latlng.lat.toFixed(3),
                    lng = e.target._latlng.lng.toFixed(3);
                    console.log(lat);
                    console.log(lng);
                });
         flag = false;     
    }  

  });

/*
Открываем справа окно с формой
*/
$('.icon-arrow-right').on("click",function(){    
    $('#map').addClass("col-8")
    $('form').css("display", "block");
    $('.icon-arrow-right').hide()
    flag = true
})
/*
Создаем обьект человека
*/
let obj_Man = {
    _id: 1,
    lat: 0,
    lng: 0,
    fio: '',
    nic: '',
    rang: 0,
    color: 'blue',
    step: 0,
    foto: '',
    file: ''
}

/*
Обрабатываем форму
*/
let sing_flag = true
$('.sing').on('click', function(event) {
    
     
    if ($('#fio').val() === "") {
        alert("Заполните поле ФИО")
        sing_flag = false
        return
    }
    if (lat === undefined) {
        alert('Укажите точку на карте');
        sing_flag = false
        return
    }
    obj_Man.fio =  $('#fio').val()
    obj_Man.nic = $('#nic').val()
    obj_Man.rang = $('input[name = gridRadios]:checked').val()
    obj_Man.color = $('#color').val() || "blue"
    obj_Man.lat = lat
    obj_Man.lng = lng
    obj_Man.step = $('#step').val()
    obj_Man._id = id
    
    try {
        pathFoto = $(".nameFoto")[0].files[0].path;
        pathFoto_name = $(".nameFoto")[0].files[0].name.split('.');
        obj_Man.foto = `foto/${id}.${pathFoto_name[1]}`

                 fs.readFile(pathFoto, function (err, data) {
                          if (err) throw err;

                          fs.writeFile(obj_Man.foto, data, function (err) {
                          if (err) throw err;
                          console.log('It\'s saved!');
                        });
                });
    } catch(e) {
        obj_Man.foto = '';
    }
    try {
    pathFile = $(".nameFile")[0].files[0].path;
    pathFile_name = $(".nameFile")[0].files[0].name.split('.');
    obj_Man.file = `file/${id}.${pathFile_name[1]}`

             fs.readFile(pathFile, function (err, data) {
                      if (err) throw err;

                      fs.writeFile(obj_Man.file, data, function (err) {
                      if (err) throw err;
                      console.log('It\'s saved!');
                    });
            });
    } catch(e) {
        obj_Man.file = '';
    }
    
    

    db.insert(obj_Man); 
    // location.reload();
    

})


let status_rang, popur, heder_boss;
db.find({}, function (err, docs) {

    
    if(!err) {
        
        docs.forEach(function(element, index) {
            

            /**
            отображаем на карте иконки
            */
            let icSize = [25, 25]
            switch (element.color) {
                case "black":
                    heder_boss = "Антимос"
                    break;
                case "purple":
                    heder_boss = "Бєкаєв Омар"
                    break; 
                case "red":
                    heder_boss = "Горадзе Міндія"
                    break; 
                case "green":
                    heder_boss = "Валерий Шеремет"
                    break; 
                case "gray":
                    heder_boss = "Владимир Дрибной"
                    break;
                case "lime":
                    heder_boss = "Гули"
                    break;                 
                default:
                    heder_boss = ""
                    break;
            }
            switch (element.rang) {
                case "vor":
                    iconURL = "assets/icons/"+element.color+"/crown.svg"
                    status_rang = "Вор в законе"
                    icSize = [60, 60]
                    heder_boss =''
                    break;
                case "see":
                    iconURL = "assets/icons/"+element.color+"/visibility-button.svg"
                    status_rang = "Смотрящий"
                    break;
                case "posit":
                    iconURL = "assets/icons/"+element.color+"/hacker.svg"
                    status_rang = "Положенец"
                    break; 
                case "bookk":
                    iconURL = "assets/icons/"+element.color+"/man-user.svg"
                    status_rang = "Держит общак"
                    break;
                case "authority":
                    iconURL = "assets/icons/"+element.color+"/man-user.svg"
                    status_rang = "Авторитет"
                    break;
                case "bandit":
                    iconURL = "assets/icons/"+element.color+"/man-user.svg"
                    status_rang = "Бандит"
                    break;                   
                // default:
                    
                //     break;
            }


            var MyIcon = DG.icon({
                        iconUrl: iconURL,
                        iconSize: icSize
                    })

            

            
           

            popur = `<div class="main">
                <center><h4>${status_rang}</h4>
                <img src=${element.foto} class="foto">
                <h4>${element.fio}</h4>
                <h5>Кличка: ${element.nic}</h5></center>
                 <span class="ref" onclick="
                  document.querySelector('#overlay').style.display = 'block'
                  document.querySelector('#modal_form').style.top = '50%';
                  document.querySelector('#modal_form').style.display = 'block'
                  document.querySelector('#frame').setAttribute('src', '${element.file}')

                            " >справка</span>   #${element._id}
                </div>`

              
     
         



               
            DG.marker([element.lat, element.lng],{icon: MyIcon}).addTo(map).bindPopup(popur).bindLabel(`от ${heder_boss}`);
             
            
   

            //  if ( element.step != "") {
                
            //     db.findOne({_id: Number(element.step)}, function (err, geoStep) {

            //         console.log(geoStep);
            //         poligon = DG.polyline([[element.lat, element.lng], [geoStep.lat, geoStep.lng]], 
            //                             {
            //                             color: element.color,
            //                             weight: 3
            //                                 }).addTo(map);
            //         });
            //     //  setTimeout(function() {
            //     //     poligon.remove(map)
            //     // }, 5000);

            // }
        })






     }

});
 
