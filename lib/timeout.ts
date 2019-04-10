async function timeout(ms: number) {
    return new Promise(resolver => setTimeout(resolver, ms))
}

export default timeout