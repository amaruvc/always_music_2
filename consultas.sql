create database always_music   
\c always_music                                  ;
create table estudiante (
nombre varchar(255) not null,
rut varchar(10) not null primary key,
curso varchar(255) not null,
nivel varchar(255) not null);

