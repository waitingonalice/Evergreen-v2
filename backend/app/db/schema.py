import uuid

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .main import Base


class Account(Base):
    __tablename__ = "Account"
    id = Column(
        Integer,
        unique=True,
        primary_key=True,
        index=True,
        default=uuid.uuid4(),
    )
    email = Column(String, unique=True, index=True)
    password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    active = Column(Boolean, default=False)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
    collections = relationship("Collection", back_populates="account")


class Collection(Base):
    __tablename__ = "Collection"
    id = Column(
        Integer,
        unique=True,
        primary_key=True,
        index=True,
        default=uuid.uuid4(),
    )
    title = Column(String, index=True)
    description = Column(String)
    createdAt = Column(DateTime(timezone=True), server_default=func.now())
    updatedAt = Column(DateTime(timezone=True), onupdate=func.now())
    account_id = Column(Integer, ForeignKey("Account.id"))
    account = relationship("Account", back_populates="collections")
