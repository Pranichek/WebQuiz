export const socket = io()

let currentScript = null


export function loadCSS(href) {
    document.querySelectorAll("link[data-page]").forEach(l => l.remove())
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.dataset.page = "true"
    document.head.appendChild(link)
}

export function loadJS(src) {
    if (currentScript) currentScript.remove()
    const script = document.createElement("script")
    script.type = "module"
    script.src = src
    document.body.appendChild(script)
    currentScript = script
}

export async function goOnline(page, publicUrl) {
    const res = await fetch(`/passing_mentor`)
    const html = await res.text();
    document.querySelector(".main").innerHTML = html

    history.pushState({ page }, "", publicUrl)
}

window.addEventListener("popstate", e => {
    if (e.state?.page) {
        goOnline(e.state.page, location.pathname)
    }
});