import uuid

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .main import Base


class Account(Base):
    __tablename__ = "Account"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="USER", nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)
    country = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.current_timestamp(),
    )
    file_record = relationship("FileRecord", back_populates="account")


class FileRecord(Base):
    __tablename__ = "FileRecord"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    path = Column(String)
    status = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    account_id = Column(
        UUID(as_uuid=True),
        ForeignKey("Account.id"),
        nullable=False,
    )
    # One-to-One relationship with Resume
    resume = relationship(
        "Resume", back_populates="file_record", uselist=False
    )
    account = relationship("Account", back_populates="file_record")


class Resume(Base):
    __tablename__ = "Resume"
    id = Column(Integer, primary_key=True, autoincrement=True)
    # Dynamic content that may change, stored as JSON.
    # Currently supports Languages, Techstack, Experiences, Certifications, Projects
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.current_timestamp(),
    )
    file_record_id = Column(
        String,
        ForeignKey("FileRecord.id"),
        nullable=False,
    )
    file_record = relationship("FileRecord", back_populates="resume")
