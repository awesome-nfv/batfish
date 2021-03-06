package org.batfish.representation.host;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.Set;
import java.util.TreeSet;
import org.batfish.common.Warnings;
import org.batfish.datamodel.Configuration;
import org.batfish.datamodel.Interface;
import org.batfish.datamodel.Ip;
import org.batfish.datamodel.Prefix;
import org.batfish.datamodel.Vrf;

public class HostInterface implements Serializable {

  private static final String BANDWIDTH_VAR = "bandwidth";

  private static final String GATEWAY_VAR = "gateway";

  private static final String NAME_VAR = "name";

  private static final String OTHER_PREFIXES_VAR = "otherPrefixes";

  private static final String PREFIX_VAR = "prefix";

  /** */
  private static final long serialVersionUID = 1L;

  private static final String VRF_VAR = "vrf";

  private Double _bandwidth = 1000 * 1000 * 1000.0; // default is 1 Gbps

  private Ip _gateway;

  private String _name;

  private Set<Prefix> _otherPrefixes;

  private Prefix _prefix;

  private Vrf _vrf;

  @JsonCreator
  public HostInterface(@JsonProperty(NAME_VAR) String name) {
    _name = name;
    _otherPrefixes = new TreeSet<>();
  }

  @JsonProperty(BANDWIDTH_VAR)
  public Double getBandwidth() {
    return _bandwidth;
  }

  @JsonProperty(GATEWAY_VAR)
  public Ip getGateway() {
    return _gateway;
  }

  @JsonProperty(NAME_VAR)
  public String getName() {
    return _name;
  }

  @JsonProperty(OTHER_PREFIXES_VAR)
  public Set<Prefix> getOtherPrefixes() {
    return _otherPrefixes;
  }

  @JsonProperty(PREFIX_VAR)
  public Prefix getPrefix() {
    return _prefix;
  }

  @JsonProperty(VRF_VAR)
  public Vrf getVrf() {
    return _vrf;
  }

  @JsonProperty(BANDWIDTH_VAR)
  public void setBandwidth(Double bandwidth) {
    _bandwidth = bandwidth;
  }

  @JsonProperty(GATEWAY_VAR)
  public void setGateway(Ip gateway) {
    _gateway = gateway;
  }

  @JsonProperty(OTHER_PREFIXES_VAR)
  public void setOtherPrefixes(Set<Prefix> otherPrefixes) {
    _otherPrefixes = otherPrefixes;
  }

  @JsonProperty(PREFIX_VAR)
  public void setPrefix(Prefix prefix) {
    _prefix = prefix;
  }

  @JsonProperty(VRF_VAR)
  public void setVrf(Vrf vrf) {
    _vrf = vrf;
  }

  public Interface toInterface(Configuration configuration, Warnings warnings) {
    Interface iface = new Interface(_name, configuration);
    iface.setBandwidth(_bandwidth);
    iface.setPrefix(_prefix);
    iface.getAllPrefixes().add(_prefix);
    iface.getAllPrefixes().addAll(_otherPrefixes);
    iface.setVrf(configuration.getDefaultVrf());
    return iface;
  }
}
