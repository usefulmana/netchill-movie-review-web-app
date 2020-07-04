package com.example.springsocial.repositories;

import com.example.springsocial.model.UserComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserCommentRepository extends JpaRepository<UserComment, Long> {
    UserComment findByUser_IdAndComment_Id (Long userId, Long commentId);
    @Transactional
    void deleteByComment_Id(Long id);
    List<UserComment> findByUser_Id(Long user_id);
}
