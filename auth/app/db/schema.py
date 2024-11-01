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
    self_hosted = relationship("SelfHosted", back_populates="account")
    self_hosted_group = relationship(
        "SelfHostedGroup", back_populates="account"
    )
    records = relationship("Records", back_populates="account")


class Records(Base):
    __tablename__ = "Records"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    status = Column(String, index=True)
    type = Column(String, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    account_id = Column(
        UUID(as_uuid=True),
        ForeignKey("Account.id"),
        nullable=False,
    )
    # One-to-One relationship with Resume
    resume = relationship("Resume", back_populates="records", uselist=False)
    files = relationship("Files", back_populates="records")
    account = relationship("Account", back_populates="records")


class Files(Base):
    __tablename__ = "Files"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String)
    size = Column(Integer)
    type = Column(String)
    src = Column(String)
    record_id = Column(
        String,
        ForeignKey("Records.id"),
    )
    self_hosted_id = Column(
        String,
        ForeignKey("SelfHosted.id"),
    )
    records = relationship("Records", back_populates="files")
    self_hosted = relationship("SelfHosted", back_populates="files")


class Resume(Base):
    __tablename__ = "Resume"
    id = Column(Integer, primary_key=True, autoincrement=True)
    # Dynamic content that may change, stored as JSON.
    # Currently supports Languages, Techstack, Experiences, Certifications, Projects
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    record_id = Column(
        String,
        ForeignKey("Records.id"),
    )
    records = relationship("Records", back_populates="resume")


class SelfHostedGroup(Base):
    __tablename__ = "SelfHostedGroup"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, primary_key=True, unique=True, nullable=False)
    account_id = Column(
        UUID(as_uuid=True),
        ForeignKey("Account.id"),
        nullable=False,
    )
    account = relationship("Account", back_populates="self_hosted_group")
    self_hosted = relationship(
        "SelfHosted", back_populates="self_hosted_group"
    )


class SelfHosted(Base):
    __tablename__ = "SelfHosted"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    url = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    group_id = Column(Integer, ForeignKey("SelfHostedGroup.id"))
    account_id = Column(
        UUID(as_uuid=True),
        ForeignKey("Account.id"),
        nullable=False,
    )
    monitoring = relationship(
        "Monitoring", back_populates="self_hosted", uselist=False
    )
    self_hosted_group = relationship(
        "SelfHostedGroup", back_populates="self_hosted"
    )
    account = relationship("Account", back_populates="self_hosted")
    files = relationship("Files", back_populates="self_hosted", uselist=False)


class Monitoring(Base):
    __tablename__ = "Monitoring"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String, nullable=False)
    interval = Column(Integer, default=60)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    self_hosted_id = Column(
        String,
        ForeignKey("SelfHosted.id"),
        unique=True,
    )
    self_hosted = relationship("SelfHosted", back_populates="monitoring")
    # One-to-Many relationship with Notifications
    notifications = relationship("Notifications", back_populates="monitoring")
    monitoring_http = relationship(
        "MonitoringHTTP", back_populates="monitoring", uselist=False
    )
    monitoring_ping = relationship(
        "MonitoringPing", back_populates="monitoring", uselist=False
    )


class MonitoringHTTP(Base):
    __tablename__ = "MonitoringHTTP"
    id = Column(Integer, primary_key=True, autoincrement=True)
    method = Column(String, nullable=False, default="GET")
    header = Column(Text)
    body = Column(Text)
    status_code = Column(Integer, nullable=False, default=200)
    min_status_code = Column(Integer)
    monitoring_id = Column(
        UUID(as_uuid=True),
        ForeignKey("Monitoring.id"),
        unique=True,
    )
    monitoring = relationship("Monitoring", back_populates="monitoring_http")


class MonitoringPing(Base):
    __tablename__ = "MonitoringPing"
    id = Column(Integer, primary_key=True, autoincrement=True)
    hostname = Column(String, nullable=False)
    monitoring_id = Column(
        UUID(as_uuid=True),
        ForeignKey("Monitoring.id"),
        unique=True,
    )
    monitoring = relationship("Monitoring", back_populates="monitoring_ping")


class Notifications(Base):
    __tablename__ = "Notifications"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(String, nullable=False)
    name = Column(String, nullable=False)
    message = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    monitoring_id = Column(
        UUID(as_uuid=True),
        ForeignKey("Monitoring.id"),
    )
    monitoring = relationship("Monitoring", back_populates="notifications")
    notify_email = relationship(
        "NotificationEmail", back_populates="notifications"
    )
    notify_telegram = relationship(
        "NotificationTelegram", back_populates="notifications"
    )


class NotificationEmail(Base):
    __tablename__ = "NotificationEmail"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, nullable=False)
    notification_id = Column(
        UUID(as_uuid=True), ForeignKey("Notifications.id")
    )
    notifications = relationship(
        "Notifications", back_populates="notify_email"
    )


class NotificationTelegram(Base):
    __tablename__ = "NotificationTelegram"
    id = Column(Integer, primary_key=True, autoincrement=True)
    chat_id = Column(String, nullable=False)
    token = Column(String, nullable=False)
    notification_id = Column(
        UUID(as_uuid=True), ForeignKey("Notifications.id")
    )
    notifications = relationship(
        "Notifications", back_populates="notify_telegram"
    )
