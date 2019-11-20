async function loadData(username) {
    console.log(`username: ${username}`);
}

window.onload = e => {
    const form = document.querySelector('#username-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);

        loadData(data.get('username'));
    });
};
