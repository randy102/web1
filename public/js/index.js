function displayBooks(books, page, numBook) {
    
    var start = Number(numBook) * (page - 1);
    var end = start + Number(numBook) - 1;
    console.log(start, end);
    let i = 0;
    $(`#${books} .card`).each(function () {
        if (i >= start && i <= end) 
            $(this).fadeIn();
        else 
            $(this).hide();
        i++;
    });
}

function pnPage(books, state, numBook) {
    var cur = Number($(`.paginate[books=${books}] li.active>.page-link`).html());
    var end = $(`.paginate[books=${books}] .page-link`).length - 2;
    if(state == 'Prev')
        cur = cur==1?cur:cur-1;
    else
        cur = cur==end?cur:cur+1;
    changePage(books,cur, numBook);
}

function changePage(books, cur, numBook) {
    if(cur == 'Prev' || cur == 'Next'){
        pnPage(books, cur, numBook);
        return;
    } 
    $(`.paginate[books=${books}] .page-item`).removeClass('active');
    $(`.paginate[books=${books}] .page-item a:contains(${cur})`).parent().addClass('active');
    displayBooks(books, cur, numBook);
}



function createPagination(books, numBook) {

    var length = $(`#${books}>.card`).length;
    var numPage = Math.ceil(length / numBook);
    var liTag = "";
    for (let i = 1; i <= numPage; i++) {
        liTag += `
            <li class="page-item ${i == 1 ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>
        `;
    }
    let content = `
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center" num=${numBook}>
                <li class="page-item">
                    <a class="page-link" href="#" >Prev</a>
                </li>
                ${liTag}
                <li class="page-item">
                    <a class="page-link" href="#">Next</a>
                </li>
            </ul>
        </nav>
    `;

    return content;
}


$(function () {
    //Render pagination
    $('.paginate').each(function () {
        let books = $(this).attr('books');
        let numBook = $(this).attr('num');
        $(this).html(createPagination(books,numBook));
    });

    //add click event to each a tag
    $('.page-link').each(function () {
        var books = $(this).closest('.paginate').attr('books');
        var numBook = $(this).closest('.pagination').attr('num');
        var cur = $(this).html();
        $(this).click(function (e) {
            e.preventDefault();
            changePage(books, cur, numBook);
        });
    });

    //Initalize each product body to hide/show element base on current page
    $('.prod-body').each(function(){
        var books = $(this).attr('id');
        var cur = Number($(`.paginate[books=${books}] li.active>.page-link`).html());
        var numBook = $(`.paginate[books=${books}] .pagination`).attr('num');
        changePage(books, cur, numBook);
    });
});