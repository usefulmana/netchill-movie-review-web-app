package com.example.springsocial.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import javax.persistence.*;
import java.util.*;

@Entity
@Table(name = "movies")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(value = {"createdAt", "lastUpdated"},
        allowGetters = true)
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tmdb_id")
    private Long tmdbId;

    @Column(name = "trailers")
    @ElementCollection
    private List<String> trailers = new ArrayList<>();

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "year", nullable = false)
    private String year;

    @Column(name = "rated")
    private String rated;

    @Column(name = "released")
    private String released;

    @Column(name = "runtime")
    private String runtime;

    @Column(name = "genre")
    private String genre;

    @Column(name = "director")
    private String director;

    @Column(name = "writer", columnDefinition="LONGTEXT" )
    private String writer;

    @Column(name = "actor", columnDefinition="LONGTEXT")
    private String actor;

    @Column(name = "plot", columnDefinition="LONGTEXT")
    private String plot;

    @Column(name = "language", columnDefinition="LONGTEXT")
    private String language;

    @Column(name = "country", columnDefinition="LONGTEXT")
    private String country;

    @Column(name = "poster")
    private String poster;

    @Column(name = "backdrop")
    private String backdrop;

    @Column(name = "metascore")
    private String metascore;

    @Column(name = "imdb_score")
    private String imdbScore;

    @Column(name = "imdb_votes")
    private String imdb_Votes;

    @Column(name = "type")
    private String type;

    @Column(name = "box_office")
    private String boxOffice;

    @Column(name = "production")
    private String production;

//    @Column(name = "date_created")
//    @CreatedDate
//    private Date dateCreated;
//
//    @Column(name = "last_updated")
//    @LastModifiedDate
//    private Date lastUpdated;

    public Movie(String title, String year) {
        this.title = title;
        this.year = year;
    }

    @Override
    public String toString() {
        return "Movie{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", year='" + year + '\'' +
                ", rated='" + rated + '\'' +
                ", released='" + released + '\'' +
                ", runtime='" + runtime + '\'' +
                ", genre='" + genre + '\'' +
                ", director='" + director + '\'' +
                ", writer='" + writer + '\'' +
                ", actor='" + actor + '\'' +
                ", plot='" + plot + '\'' +
                ", language='" + language + '\'' +
                ", country='" + country + '\'' +
                ", poster='" + poster + '\'' +
                ", metascore='" + metascore + '\'' +
                ", imdbScore='" + imdbScore + '\'' +
                ", imdb_Votes='" + imdb_Votes + '\'' +
                ", type='" + type + '\'' +
                ", boxOffice='" + boxOffice + '\'' +
                ", production='" + production + '\'' +
                '}';
    }
}
