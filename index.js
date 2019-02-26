const puppeteer = require('puppeteer');
const screenshot = 'lendastv.png';

(async () => {

    try {
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()
        await page.setViewport({ width: 1280, height: 800 })

        const navigationPromise = page.waitForNavigation()

        await page.goto('http://legendas.tv/login')
        //await page.click('body > div.container > header > section > div.login > a.js_entrar')

        await page.type('#UserUsername', 'fliperapp')
        await page.type('#UserPassword', '123456')
        await page.click('#UserLoginForm > button')
        //await page.waitForNavigation()

        await navigationPromise

        await page.waitForSelector('#help-box-close')
        await page.click('#help-box-close')

        await page.type('#search-box', 'The Simpsons')
        await page.keyboard.press(String.fromCharCode(13))
        await page.waitForSelector('#resultado_busca')


        await page.screenshot({ path: screenshot })
        const res = await page.$$('#resultado_busca div')
        console.log(res.length)
        const data = []

        for (const teste of res) {
            const nome = await teste.$eval('p', p => p.innerText)
            //console.log(nome)

            const imagem = await teste.$eval('img', img => img.getAttribute('src')).catch(x => null)
            //console.log(imagem)    

            const link =  'http://legendas.tv' + await teste.$eval('a', img => img.getAttribute('href')).catch(x => null)


            data.push({ nome, imagem,link })
        }

        console.log(data)
        // const legendas = await page.$$eval('div.f_left', x => {
        //     return x.map(x => x.textContent.trim())
        //   })
        // console.log(legendas)

        browser.close()
        //console.log('See screenshot: ' + screenshot)

    } catch (error) {
        console.log(error)
    }
})()