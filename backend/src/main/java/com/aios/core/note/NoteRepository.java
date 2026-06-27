package com.aios.core.note;

import com.aios.core.user.AppUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserOrderByUpdatedAtDesc(AppUser user);

    List<Note> findTop10ByUserOrderByUpdatedAtDesc(AppUser user);

    Optional<Note> findByIdAndUser(Long id, AppUser user);
}
