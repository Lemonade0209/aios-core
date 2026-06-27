package com.aios.core.project;

import com.aios.core.user.AppUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByUserOrderByUpdatedAtDesc(AppUser user);

    Optional<Project> findByIdAndUser(Long id, AppUser user);
}
