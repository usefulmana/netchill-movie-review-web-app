import React, { useState, useEffect, Component } from "react";
import Layout from "../core/Layout";
import "../css/MovieManage.css"
import { getMoviesPage, newMovie, updateMovie, deleteMovie } from './apiAdmin'

class MovieManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieList: [],
            showNew: false,
            totalPages: 0,
            currentPage: 1,
            size: 10,
            filmID : '',
            title: '',
            description: '',
            country: '',
            poster: ''
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        this.setState(state => ({
            showNew: !state.showNew
        }));
    }
    loadMovies(page){
        console.log(page);
        console.log(this.state.currentPage);
        getMoviesPage({page}).then((res) => {
            console.log("movie list : ", res.content)
            this.setState({
                movieList: res.content,
                totalPages: res.totalPages,
                currentPage: page
            })
        })
    }

    perPage(e){
        console.log(e.target.value);
        this.setState({
            size: e
        })
    }

    deleteFilm(id){
        var result = window.confirm("Want to delete?");
        if (result) {
            deleteMovie({id}).then((res) => {
                console.log("deleted")
                this.loadMovies(this.state.currentPage);
            })
        }
    }
    editFilm(id, title, description, country, poster){
        this.setState({
            filmID: id,
            title: title,
            description: description,
            country: country,
            poster: poster,
            showNew: true
        })

    }

    newFilm(){
        if(this.state.filmID == ''){
            var requestBody={
                "title": this.state.title,
                "year": '2019',
                "rated": null,
                "released": null,
                "runtime": null,
                "genre": null,
                "director": null,
                "writer": null,
                "actor": null,
                "plot": this.state.description,
                "language": null,
                "country": this.state.country,
                "poster": this.state.poster,
                "metascore": null,
                "imdbScore": null,
                "imdb_Votes": null,
                "type": null,
                "boxOffice": null,
                "production": null,
                "dateCreated": null,
                "lastUpdated": null
            }
            newMovie(requestBody).then((res)=>{
                this.loadMovies(this.state.totalPages);
                this.setState({
                    title: '',
                    description: '',
                    country: '',
                    poster: ''
                })
            })
        }else{
            var requestBody={
                "id": this.state.filmID,
                "trailers": [],
                "title": this.state.title,
                "year": "2313",
                "rated": null,
                "released": null,
                "runtime": null,
                "genre": null,
                "director": null,
                "writer": null,
                "actor": null,
                "plot": this.state.description,
                "language": null,
                "country": this.state.country,
                "poster": this.state.poster,
                "backdrop": null,
                "metascore": null,
                "imdbScore": null,
                "imdb_Votes": null,
                "type": null,
                "boxOffice": null,
                "production": null,
                "dateCreated": "2019-11-02T03:24:43.000+0000",
                "lastUpdated": "2019-12-08T12:02:25.044+0000"
            }
            updateMovie(requestBody, this.state.filmID).then((res)=>{
                this.loadMovies(this.state.totalPages);
                this.setState({
                    filmID: '',
                    title: '',
                    description: '',
                    country: '',
                    poster: ''
                })
            })
        }
    }
    handleChange(e, type){
        if(type == 'title'){
            this.setState({
                title: e.target.value
            })
        }else if(type == 'description'){
            this.setState({
                description: e.target.value
            })
        }else if(type == 'country'){
            this.setState({
                country: e.target.value
            })
        }
        else if(type == 'poster'){
            this.setState({
                poster: e.target.value
            })
        }
        console.log(type);
        
    }




    async componentDidMount() {
        this.loadMovies(1);
    }
    
    

    render() {
        let pagination = [];
        let leftDot = true;
        let rightDot = true;
        for (let i = 1; i <= this.state.totalPages; i++) {
            if((i < this.state.currentPage) && (i > (this.state.currentPage - 3))){
                pagination.push(<li className="page-item"><a className="page-link" onClick={() => this.loadMovies(i)}>{ i }</a></li>);
            }else if((i > this.state.currentPage) && (i < (this.state.currentPage + 3))){
                pagination.push(<li className="page-item"><a className="page-link" onClick={() => this.loadMovies(i)}>{ i }</a></li>);
            }else if(this.state.currentPage == i){
                pagination.push(<li className="page-item disabled"><a className="page-link" onClick={() => this.loadMovies(i)}>{ i }</a></li>);
            }
        }




        let leftPage = [];

        if(this.state.currentPage == 1){
            leftPage.push(<li className="page-item disabled">
                        <a className="page-link">
                        <i class="fas fa-angle-left"></i></a></li>);
        }else{
            leftPage.push(<li className="page-item">
                        <a className="page-link" onClick={() => this.loadMovies(this.state.currentPage - 1)}>
                        <i class="fas fa-angle-left"></i></a></li>);
        }


        let rightPage = [];

        if(this.state.currentPage == this.state.totalPages){
            rightPage.push(<li className="page-item disabled">
                        <a className="page-link">
                        <i class="fas fa-angle-right"></i></a></li>);
        }else{
            rightPage.push(<li className="page-item">
                        <a className="page-link" onClick={() => this.loadMovies(this.state.currentPage + 1)}>
                        <i class="fas fa-angle-right"></i></a></li>);
        }

        let left = [];

        if(this.state.currentPage == 1){
            left.push(<li className="page-item disabled">
                        <a className="page-link">
                        <i class="fas fa-angle-double-left"></i></a></li>);
        }else{
            left.push(<li className="page-item">
                        <a className="page-link" onClick={() => this.loadMovies(1)}>
                        <i class="fas fa-angle-double-left"></i></a></li>);
        }


        let right = [];

        if(this.state.currentPage == this.state.totalPages){
            right.push(<li className="page-item disabled">
                        <a className="page-link">
                        <i class="fas fa-angle-double-right"></i></a></li>);
        }else{
            right.push(<li className="page-item">
                        <a className="page-link" onClick={() => this.loadMovies(this.state.totalPages)}>
                        <i class="fas fa-angle-double-right"></i></a></li>);
        }

        return (
            <Layout>
                <div className="position-relative overflow-auto full-height">
                    <div className="row z-content-center logo-for-movie animated finite slideInDown faster">
                        <div className="movie_manage">
                            <div className="header-col">
                                <div className="laber-col">
                                    <div className="col-laber">Movie Manage</div>
                                </div>
                                <div className="right-col">
                                    <div className="right-search">
                                        <input className="form-control form-control-sm" type="text" placeholder="Search"/>
                                        <button type="button" className="btn btn-default btn-sm btn-search">Search</button>
                                    </div>
                                    <div className="right-button">
                                        <button type="button" className="btn btn-default btn-sm" onClick={this.handleClick}>{ this.state.showNew ? 'X' : 'New' }</button>
                                    </div> 
                                </div>
                            </div>
                            <div className="new-movie" style={{display: this.state.showNew ? 'block' : 'none' }}>
                                <input type="hidden" name="film_id" value={this.state.filmID}></input>
                                <div className="new-col">
                                    <div className="new-head-left">
                                        <div className="laber-head-content">
                                            <div className="">Title</div>
                                        </div>
                                        <div className="content-head-content">
                                            <input className="form-control form-control-sm" type="text" value={ this.state.title } onChange={e => this.handleChange(e, 'title')}/>
                                        </div>
                                    </div>
                                    <div className="new-head-right">
                                        <button type="button" className="btn btn-default btn-sm btn-block" onClick={() => this.newFilm()}>New Film</button>
                                    </div>
                                </div>
                                <div className="new-col">
                                    <div className="new-full">
                                        <div className="laber-content-full">
                                            <div className="">Description</div>
                                        </div>
                                        <div className="content-content-full">
                                            <textarea className="form-control" rows="5" id="comment" value={ this.state.description }  onChange={e => this.handleChange(e, 'description')}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="new-col">
                                    <div className="new-left">
                                        <div className="laber-content">
                                            <div className="">Country</div>
                                        </div>
                                        <div className="content-content">
                                            <input className="form-control form-control-sm" type="text" value={ this.state.country } onChange={e => this.handleChange(e, 'country')}/>
                                        </div>
                                    </div>
                                    <div className="new-right">
                                        <div className="laber-content">
                                            <div className="">Poster</div>
                                        </div>
                                        <div className="content-content">
                                            <input className="form-control form-control-sm" type="text" value={ this.state.poster } onChange={e => this.handleChange(e, 'poster')}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="movie-col">
                                <div className="id-col">
                                    <div>ID</div>
                                </div>
                                <div className="name-col">
                                    <div>Name</div>
                                </div>
                                <div className="genre-col">
                                    <div>Genre</div>
                                </div>
                                <div className="des-col">
                                    <div>Description</div>
                                </div>
                                <div className="time-col">
                                    <div>Created at</div>
                                </div>
                                <div className="action-col">
                                    <div>Action</div>
                                </div>
                            </div>
                            {this.state.movieList.map(item => (
                                <div className="movie-col">
                                    <div className="id-col">
                                        <div>{ item.id }</div>
                                    </div>
                                    <div className="name-col">
                                        <div>{ item.title }</div>
                                    </div>
                                    <div className="genre-col">
                                        <div>{ item.genre }</div>
                                    </div>
                                    <div className="des-col">
                                        <div>{ item.plot }</div>
                                    </div>
                                    <div className="time-col">
                                        <div>{ item.released }</div>
                                    </div>
                                    <div className="action-col">
                                        <button type="button" className="btn btn-default btn-sm" onClick={() => this.editFilm(item.id, item.title, item.plot, item.country, item.poster)}>Edit</button>
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => this.deleteFilm(item.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                            <nav>
                                <ul className="pagination justify-content-center">
                                    <li className="page-item info">
                                        <select defaultValue={this.state.size}  onChange={() => this.perPage} name="perpage" className="custom-select">
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="15">15</option>
                                            <option value="20">20</option>
                                        </select>
                                    </li>
                                    <li className="page-item perpage disabled">
                                        <a className="page-link">
                                        Item per page
                                        </a>
                                    </li>
                                    { left }
                                    { leftPage }
                                    { pagination }
                                    { rightPage }
                                    { right }
                                    <li className="page-item info disabled">
                                        <a className="page-link">
                                        Page { this.state.currentPage }/ { this.state.totalPages }
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="movie-page-background"></div>
                </div>
            </Layout>
        )
    }

}


export default MovieManage