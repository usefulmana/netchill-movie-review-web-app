package com.example.springsocial.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.*;


@Entity
@Table(name = "user_comment")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "comment_id")
    @JsonIgnore
    private Comment comment;

    @Column(name = "status", nullable = false)
    private String status;

    public UserComment(User user, Comment comment, String status) {
        this.user = user;
        this.comment = comment;
        this.status = status;
    }
}
