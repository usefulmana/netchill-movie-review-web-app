package com.example.springsocial.controller;

import com.example.springsocial.exception.ResourceNotFoundException;
import com.example.springsocial.exception.ResourceOwnerDoesNotMatchException;
import com.example.springsocial.model.*;
import com.example.springsocial.payload.CommentResponse;
import com.example.springsocial.repositories.CommentRepository;
import com.example.springsocial.repositories.MovieRepository;
import com.example.springsocial.repositories.UserCommentRepository;
import com.example.springsocial.repositories.UserRepository;
import com.example.springsocial.security.CurrentUser;
import com.example.springsocial.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserCommentRepository userCommentRepository;

    @GetMapping("/comments/{id}")
    public Comment getCommentById(@PathVariable(value = "id") Long commentId)
            throws ResourceNotFoundException {
        return commentRepository.findById(commentId)
                .orElseThrow(ResourceNotFoundException::new);
    }

    @GetMapping("/comments")
    public Page<Comment> getCommentsByMovie(@RequestParam(value = "movie_id") Long movie_id, Pageable pageable,
                                            @CurrentUser UserPrincipal userPrincipal) {

//        if (!Objects.isNull(userPrincipal)){
//            List<Comment> comments = commentRepository.findByMovie_Id(movie_id);
//            List<Comment> outputs = new ArrayList<>();
//            for (Comment c :
//                    comments) {
//                UserComment userComment = userCommentRepository.findByUser_IdAndComment_Id(userPrincipal.getId(), c.getId());
//                if (!Objects.isNull(userComment)){
//                    c.setStatus(userComment.getStatus());
//                    outputs.add(c);
//                }
//                else{
//                    outputs.add(c);
//                }
//            }
//
//            return arrayToPages(outputs, pageable);
//        }
        return commentRepository.findByMovie_Id(movie_id, pageable);
    }

    @GetMapping("/comments/notification")
    public Page<Comment> getReplies(@CurrentUser UserPrincipal userPrincipal, Pageable pageable){
        List<Comment> comments = commentRepository.findTop10ByUser_IdOrderByLastUpdatedDesc(userPrincipal.getId());
        List<Comment> notif = new ArrayList<>();

        for (Comment c :
                comments) {
            if (c.getChildComments().size() != 0) {
                notif.add(c);
            }
        }
        return  arrayToPages(notif, pageable);
    }

    @PatchMapping("/comments/{id}")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public ResponseEntity<?> upVoteOrDownVoteAComment(@PathVariable(name = "id") Long id,
                                                   @RequestParam(name = "method") String method,
                                                   @CurrentUser UserPrincipal userPrincipal){
        Comment comment = commentRepository.findById(id).orElseThrow(ResourceNotFoundException::new);
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(ResourceNotFoundException::new);
        UserComment userComment = userCommentRepository.findByUser_IdAndComment_Id(user.getId(), id);
        if (Objects.isNull(userComment)){
            if (method.equalsIgnoreCase("upvote")){
                comment.setUpVote(comment.getUpVote() + 1);
                UserComment userComment1 = new UserComment(user, comment, "upvote");
                userCommentRepository.save(userComment1);
                return ResponseEntity.ok(new CommentResponse("upvote", commentRepository.save(comment)));
            }
            else if(method.equalsIgnoreCase("downvote")){
                comment.setUpVote(comment.getUpVote() - 1);
                UserComment userComment1 = new UserComment(user, comment, "downvote");
                userCommentRepository.save(userComment1);
                return ResponseEntity.ok(new CommentResponse("downvote", commentRepository.save(comment)));
            }
            else{
                throw new IllegalArgumentException("Wrong parameter");
            }
        }
        else {
            if(userComment.getStatus().equalsIgnoreCase("downvote")){
                if (method.equalsIgnoreCase("upvote")){
                    comment.setUpVote(comment.getUpVote() + 1);
                    userComment.setStatus("upvote");
                    userCommentRepository.save(userComment);
                    return ResponseEntity.ok(new CommentResponse("upvote", comment));
                }
                else{
                    return ResponseEntity.ok(new CommentResponse("downvote", comment));
                }

            }
            else{
                if(method.equalsIgnoreCase("downvote")){
                    comment.setUpVote(comment.getUpVote() - 1);
                    userComment.setStatus("downvote");
                    userCommentRepository.save(userComment);
                    return ResponseEntity.ok(new CommentResponse("downvote", comment));

                }
                else{
                    return ResponseEntity.ok(new CommentResponse("upvote", comment));
                }

            }
        }
    }

    @PostMapping("/comments")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public Comment createComment(@RequestBody Comment comment,
                                 @CurrentUser UserPrincipal userPrincipal,
                                 @RequestParam(value = "movie_id") Long movie_id,
                                 @RequestParam(value = "parent_id", required = false) Long parent_id)
            throws ResourceNotFoundException {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
                ResourceNotFoundException::new
        );
        Movie movie = movieRepository.findById(movie_id).orElseThrow(
                ResourceNotFoundException::new
        );
        comment.setUser(user);
        comment.setMovie(movie);
        if (parent_id != null) {
            Comment comment1 = commentRepository.findById(parent_id)
                    .orElseThrow(ResourceNotFoundException::new);
            comment.setParentComment(comment1);
            comment.setUser(user);
            comment.setMovie(movie);
            return commentRepository.save(comment);
        }
        return commentRepository.save(comment);
    }

    @DeleteMapping("/comments")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public Comment deleteAComment(@RequestParam(value = "comment_id") Long comment_id,
                                            @RequestParam(value = "user_id") Long user_id)
            throws ResourceNotFoundException, ResourceOwnerDoesNotMatchException {
        Comment comment = commentRepository.findById(comment_id)
                .orElseThrow(ResourceNotFoundException::new);
        User user = userRepository.findById(user_id).orElseThrow(
                ResourceNotFoundException::new
        );

        if (user.getId().equals(comment.getUser().getId())) {
            comment.setContent("Deleted by owner");
            return commentRepository.save(comment);
        } else if (user.getRole() == Role.ROLE_ADMIN) {
            comment.setContent("Deleted by admins");
            commentRepository.save(comment);
            return commentRepository.save(comment);
        } else {
            throw new ResourceOwnerDoesNotMatchException();
        }
    }

    @PutMapping("/comments/{id}")
    @Secured({"ROLE_USER", "ROLE_MODERATOR", "ROLE_ADMIN"})
    public Comment updateAComment(@PathVariable(value = "id") Long comment_id,
                                  @RequestBody Comment comment,
                                  @CurrentUser UserPrincipal userPrincipal)
            throws ResourceOwnerDoesNotMatchException, ResourceNotFoundException {
        Comment comment1 = commentRepository.findById(comment_id)
                .orElseThrow(ResourceNotFoundException::new);
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow(
                ResourceNotFoundException::new
        );
        if (user.getId().equals(comment1.getUser().getId())) {
            comment1 = comment;
            return commentRepository.save(comment1);
        } else if (user.getRole() == Role.ROLE_ADMIN) {
            comment1 = comment;
            return commentRepository.save(comment1);
        } else {
            throw new ResourceOwnerDoesNotMatchException();
        }
    }

    private Page<Comment> arrayToPages(List<Comment> movieList, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), movieList.size());
        return new PageImpl<Comment>(movieList.subList(start, end), pageable, movieList.size());
    }

}
