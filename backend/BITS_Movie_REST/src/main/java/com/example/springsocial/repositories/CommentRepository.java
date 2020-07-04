package com.example.springsocial.repositories;

import com.example.springsocial.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;



import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

//    public List<Comment> findByParent_id(Long parent_id);
    @Query(value = "SELECT * from comments c where c.parent_id IS NULL and c.movie_id=?1 order by c.created_at desc", nativeQuery = true)
    public Page<Comment> findByMovie_Id(Long movie_id, Pageable pageable);
    public List<Comment> findByMovie_Id(Long movie_id);
    public List<Comment> findTop10ByUser_IdOrderByLastUpdatedDesc(Long user_id);
//    @Query(value = "SELECT * from comments c where c.parent_id IS NULL and c.movie_id=?1 order by c.upvotes desc", nativeQuery = true)
//    public Page<Comment> findByMovie_IdAndOrderByUpVote(Long movie_id, Pageable pageable);

    @Transactional
    @Query(value = "delete from comments c where c.parent_id IS NOT null and c.movie_id=?1", nativeQuery = true)
    void deleteChildrenByMovie_Id(Long id);

    @Transactional
    void deleteByMovie_Id(Long id);
}
