const puppeteer = require('puppeteer');
const screenshot = 'lendastv.png';
const URL_LEGENDASTV = 'http://legendas.tv/login';

(async () => {

    try {

        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.setViewport({ width: 1280, height: 800 })

        const navigationPromise = page.waitForNavigation()

        await page.goto(URL_LEGENDASTV)

        await page.type('#UserUsername', process.env.LEGENDASTV_USER)
        await page.type('#UserPassword', process.env.LEGENDASTV_PWS)
        await page.click('#UserLoginForm > button')

        await navigationPromise

        await page.waitForSelector('#help-box-close')
        await page.click('#help-box-close')

        await page.type('#search-box', 'The Simpsons')
        await page.keyboard.press(String.fromCharCode(13))
        await page.waitForSelector('#resultado_busca div')


        const legendas = await page.$$('#resultado_busca div div')
        const data = []

        for (const legenda of legendas) {
            const imagem = await legenda.$eval('img', img => img.getAttribute('src')).catch(x => null)
            const nome = await legenda.$eval('p', p => p.innerText)
            //#resultado_busca > div > article:nth-child(2) > div:nth-child(12) > img
            const link = 'http://legendas.tv' + await legenda.$eval('a', img => img.getAttribute('href')).catch(x => null)

            data.push({ nome, imagem, link })
        }

        //Armazena no banco
        salvadados(data)

        await page.screenshot({ path: screenshot })
        browser.close()

    } catch (error) {
        //Notifica erro ao monitoramento
        console.log(error)
    }
})()

function salvadados(data) {
    console.log(data)
}