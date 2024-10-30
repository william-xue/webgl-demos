

let callback1 = () => {
    console.log(layui)
    const {jquery,  layer, miniAdmin , miniTongji} = layui
    let  $ = layui.jquery;
    console.log(layui.miniAdmin.configOptions)
    const {title, loginOutHref, image } = layui.miniAdmin.configOptions.logoInfo
    // 标题1
    let titleHtml = `
        <div class="title1">
            <div class="title1-item1">
                <img src="${image}" height="40"/>
                ${title || ''}
            </div>
            <div class="title1-item2"><a href='${loginOutHref}'>退出</a></div>
        </div>
    `
    $('.header').html(titleHtml)

}


// let callback2 = () => {
//     console.log(layui)
//     const {jquery,  layer, miniAdmin , miniTongji} = layui
//     let  $ = layui.jquery;
//     console.log(layui.miniAdmin.configOptions)
//     // 标题1
//     let titleHtml = `
//         <div class="title2">
//             <h1></h1>
//         </div>
//     `
//     $('.header').append(titleHtml)

// }