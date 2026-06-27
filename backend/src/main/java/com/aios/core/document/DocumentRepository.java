package com.aios.core.document;

import com.aios.core.user.AppUser;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {
    List<DocumentEntity> findByUserOrderByUpdatedAtDesc(AppUser user);

    List<DocumentEntity> findTop10ByUserOrderByUpdatedAtDesc(AppUser user);

    Optional<DocumentEntity> findByIdAndUser(Long id, AppUser user);
}
