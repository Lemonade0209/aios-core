package com.aios.core.note;

import com.aios.core.user.AppUser;
import com.aios.core.project.Project;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUserOrderByUpdatedAtDesc(AppUser user);

    List<Note> findTop10ByUserOrderByUpdatedAtDesc(AppUser user);

    List<Note> findByProject(Project project);

    Optional<Note> findByIdAndUser(Long id, AppUser user);
}
