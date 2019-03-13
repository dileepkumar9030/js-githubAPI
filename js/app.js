class GITHUB{
    constructor(){
        this.client_id='ab86f35937da62a1dc3a';
        this.client_secret='8b70d29371a6ac537f5a6544cb754c781f3bdffe';
        this.base='https://api.github.com/users/';
    }

    async ajaxUser(userValue){
        //userURL
        const userURL=`${this.base}${userValue}?client_id='${this.client_id}'&client_secret='${this.client_secret}'`;
        //repos URL
        const reposURL=`${this.base}${userValue}/repos?client_id='${this.client_id}'&client_secret='${this.client_secret}'`;
        //get users
        const userData= await fetch(userURL);
        const user = await userData.json();
        //get repos
        const reposData= await fetch(reposURL);
        const repos = await reposData.json();
        return {
            user,
            repos
        };
    }
}

class UI{
    constructor(){
        
    }

    //feedback
    showFeedback(text){
            const feedback = document.querySelector('.feedback');
            feedback.classList.add('showItem');
            feedback.innerHTML=`<p>${text}</p>`;
            setTimeout(()=>{
                feedback.classList.remove('showItem')
            }, 3000);
    }

    getUser(user){
        const {
            avatar_url:image,
            html_url:link, 
            public_repos:repos,
            name,
            login,
            message
        }=user;
        //console.log(message)
        if(message==='Not Found'){
            this.showFeedback('No such user exists, please enter a valid value');
        }else{
            this.displayUser(image, link, repos, name, login);
            const searchUser = document.getElementById('searchUser');
            searchUser.value='';
        }
 
    }

    displayUser(image, link, repos, name, login){
        //console.log(image, link, repos, name, login);
        const usersList=document.getElementById('github-users');
        const div=document.createElement('div');
        div.classList.add('row','single-user','my-3');
        div.innerHTML=`
            <div class=" col-sm-6 col-md-4 user-photo my-2">
                <img src="${image}" class="img-fluid" alt="">
            </div>
            <div class="col-sm-6 col-md-4 user-info text-capitalize my-2">
                <h6>name : <span>${name}</span></h6>
                <h6>github : <a href="${link}" class="badge badge-primary">link</a> </h6>
                <h6>public repos : <span class="badge badge-success">${repos}</span> </h6>
            </div>
            <div class=" col-sm-6 col-md-4 user-repos my-2">
                <button type="button" data-id='${login}' id="getRepos" class="btn reposBtn text-capitalize mt-3">get repos</button>
            </div>
        `;
        usersList.appendChild(div);
    }

    displayRepos(userID, repos){
        const reposBtn = document.querySelectorAll('[data-id]');
        reposBtn.forEach(btn=>{
            if(btn.dataset.id===userID){
                const parent = btn.parentNode;
                repos.forEach(repo=>{
                    const p = document.createElement('p');
                    p.innerHTML=`<a href='${repos.html_url}' target='_blank'>${repo.name}</a>`;
                    parent.appendChild(p)
                })
            }
        })
    }
}

(function(){
    const ui = new UI();
    const github = new GITHUB();

    const searchForm = document.getElementById('searchForm');
    const searchUser = document.getElementById('searchUser');
    const userList = document.getElementById('github-users');

    searchForm.addEventListener('submit', function(e){
        e.preventDefault();
        const textValue=searchUser.value;
        //console.log(textValue);
        if(textValue===''){
            ui.showFeedback('Please enter valid user');
        }else{
            github.ajaxUser(textValue).then(data=>ui.getUser(data.user)).catch(e=>console.log(e));
        }
    });

    userList.addEventListener('click', event=>{
        //console.log(event.target)
        if(event.target.classList.contains('reposBtn')){
            const userID=event.target.dataset.id;
            github.ajaxUser(userID).then(data=>ui.displayRepos(userID,data.repos)).catch(e=>console.log(e));

        }
    })



})();