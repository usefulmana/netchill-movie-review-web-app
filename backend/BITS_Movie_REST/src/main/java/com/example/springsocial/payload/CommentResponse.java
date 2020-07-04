package com.example.springsocial.payload;

import com.example.springsocial.model.Comment;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentResponse {

    private String voted;
    private Comment comment;

    public CommentResponse(String voted, Comment comment) {
        this.voted = voted;
        this.comment = comment;
    }
}
