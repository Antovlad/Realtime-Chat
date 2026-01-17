package ro.chat.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PresenceService {

    private final Map<String, Set<String>> roomToUsers = new ConcurrentHashMap<>();

    public List<String> join(String room, String user) {
        roomToUsers.computeIfAbsent(room, r -> ConcurrentHashMap.newKeySet()).add(user);
        return snapshot(room);
    }

    public List<String> leave(String room, String user) {
        Set<String> users = roomToUsers.get(room);
        if (users != null) {
            users.remove(user);
            if (users.isEmpty()) roomToUsers.remove(room);
        }
        return snapshot(room);
    }

    public List<String> snapshot(String room) {
        Set<String> users = roomToUsers.getOrDefault(room, Collections.emptySet());
        List<String> list = new ArrayList<>(users);
        list.sort(String::compareToIgnoreCase);
        return list;
    }
}
