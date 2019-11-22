async function loadData(username) {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (!res.ok) {
        alert(`Failed to fetch info for ${username}`);
        return;
    }

    const info = await res.json();
    console.log(info);
    $('#info-title').text(`User: ${info.login}`);
    $('#info-avatar').attr('src', info.avatar_url);
    $('#info-link').attr('href', info.html_url);
    $('#info-name').text(info.name);
}

window.onload = e => {
    const form = $('#username-form');
    form.submit(e => {
        e.preventDefault();
        const data = new FormData(form[0]);

        loadData(data.get('username'));
    });
};
