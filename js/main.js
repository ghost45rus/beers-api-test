let pages = [];

$(document).ready(function(){

    $(document).mouseup(function (e){
        let div = $(".modal-window");
        if (!div.is(e.target)
            && div.has(e.target).length === 0) {
            $(".modal-wrapper").addClass("modal-wrapper_hide");
            $("#beer_name").val("");
            $("#beer_description").val("");
            $("#beer_id").val("");
            $("#page").val("");
        }
    });
    $(".list_beers").hide();
    $(".paggination").hide();
    getBear(url, params).then((data) => {
        pages.push({page: params.page, list: data});
        setTimeout(() => {
            $(".loader").hide()
            drawList(params.page)
            $(".list_beers").show();
            $(".paggination").show();
        }, 1500);

    })
});

function drawList() {
    let list_beers = $(".list_beers");
    $(".list_beers").children().remove();
    pages.forEach(item => {
        item.list.forEach(bear => {
            let div = $('<div class="list_beers__card">')
            div.append("<p>"+ bear.id + " </p>")
            div.append("<p class='list_beers__card__name'>"+ bear.name + " </p>")
            if (bear.image_url != null){
                div.append('<img class="list_beers__card__img" src="' + bear.image_url +'">')
            }
            else{
                div.append('<img class="list_beers__card__img" src="img/no_img.png">')
            }
            div.append("<p class='list_beers__card__description'>"+ bear.description + " </p>")
            div.append("<p class='list_beers__card__brewers_tips'>"+ bear.brewers_tips + " </p>")
            let buttons = $('<div class="buttons">');
            let buttonEdit = $("<button class='button' type='button'>edit</button>").on('click', (event) =>{
                editForm(bear, item.page)
            })
            buttons.append(buttonEdit);
            let buttonDelete = $("<button type='button' class='button'>delete</button>").on('click', (event) =>{
                deleteBeers(bear.id, item.page)
            });
            buttons.append(buttonDelete);
            div.append(buttons);
            list_beers.append(div)

        })
    })
}

function editForm(bear, page){
    $(".modal-wrapper").removeClass('modal-wrapper_hide')
    $("#beer_name").val(bear.name);
    $("#beer_description").val(bear.description);
    $("#beer_id").val(bear.id);
    $("#page").val(page);
}

function applyForm(){
    let page = pages.find(item => item.page == Number($("#page").val()));
    let bear = page.list.find(item => item.id == Number($("#beer_id").val()));
    bear.name = $("#beer_name").val();
    bear.description = $("#beer_description").val();
    drawList();
    $(".modal-wrapper").addClass("modal-wrapper_hide");
}

function deleteBeers(id, page){
    let findedPage = pages.find(item => item.page === page);

    findedPage.list = findedPage.list.filter((item) => item.id !== id);
    drawList();
}

async function nextPage(){
    params.page++;
    $(".loader").show();
    $(".list_beers").hide();
    $(".paggination").hide();
    await getBear(url, params).then((data) => {

        if (data.length != 0){
            pages.push({page: params.page, list: data});
        }
        setTimeout(()=> {
            drawList();
            $(".loader").hide();
            $(".list_beers").show();
            if (data.length == 0){
                $(".paggination").hide();
            }
            else{
                $(".paggination").show();
            }
        }, 1500)
    })
}